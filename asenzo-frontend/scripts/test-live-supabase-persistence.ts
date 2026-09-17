import { NextRequest } from 'next/server';
import { POST as intelligenceCardsPost } from '../src/app/api/automation/intelligence-cards/route';
import { getAdminSupabaseClient } from '../src/lib/supabase/admin';
import { CANONICAL_DEFAULT_WORKSPACE_ID, isValidUuid } from '../src/lib/automation/workspace';

async function runLivePersistenceVerification() {
  console.log('\n================================================================');
  console.log('RUNTIME PERSISTENCE VERIFICATION (API -> SUPABASE INTEGRATION)');
  console.log('================================================================\n');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let hostname = 'unknown';
  try {
    if (supabaseUrl) hostname = new URL(supabaseUrl).hostname;
  } catch {}

  console.log('[Safe Diagnostics Environment Check]');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'undefined (development default)');
  console.log('  SUPABASE_URL exists:', Boolean(supabaseUrl));
  console.log('  SUPABASE_SERVICE_ROLE_KEY exists:', Boolean(serviceKey));
  console.log('  Supabase project hostname:', hostname);

  const supabase = getAdminSupabaseClient();
  console.log('  getAdminSupabaseClient() initialized real client:', Boolean(supabase));

  if (!supabase) {
    console.error('\n❌ FATAL: Supabase client could not be initialized.');
    process.exit(1);
  }

  const timestamp = new Date().toISOString();
  const testExactLanguage = `Verification test card for live Supabase persistence at ${timestamp}`;
  const payload = {
    workspace_id: CANONICAL_DEFAULT_WORKSPACE_ID,
    source_type: 'runtime_integration_test',
    category: 'pain',
    signal_type: 'persistence_verification',
    exact_language: testExactLanguage,
    observation_type: 'observed_fact',
    confidence: 0.99
  };

  const apiKey = process.env.ASENZO_AUTOMATION_API_KEY || 'default-test-token';
  process.env.ASENZO_AUTOMATION_API_KEY = apiKey;

  let apiResponseData: any = null;
  let returnedId: string | null = null;

  // 1. Attempt HTTP call if a live server is running on port 3000
  let usedLiveServer = false;
  try {
    const healthCheck = await fetch('http://localhost:3000/api/automation/health', {
      headers: { 'x-automation-token': apiKey }
    });
    if (healthCheck.ok) {
      console.log('\n[Mode] Detected running Next.js HTTP server on http://localhost:3000');
      usedLiveServer = true;
      const res = await fetch('http://localhost:3000/api/automation/intelligence-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-automation-token': apiKey
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      console.log('  HTTP Server Status:', res.status);
      console.log('  HTTP Server Response Body:', JSON.stringify(json, null, 2));

      if (!res.ok || !json.success) {
        throw new Error(`HTTP server returned error: ${JSON.stringify(json)}`);
      }
      apiResponseData = json.data;
      returnedId = json.data?.id;
    }
  } catch {
    // Live server not running on port 3000; execute through route handler
  }

  // 2. If live server was not reachable, execute directly through the API route handler
  if (!usedLiveServer) {
    console.log('\n[Mode] Running through Route Handler (intelligenceCardsPost)');
    const req = new NextRequest(new URL('http://localhost:3000/api/automation/intelligence-cards'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-automation-token': apiKey
      },
      body: JSON.stringify(payload)
    });

    const res = await intelligenceCardsPost(req);
    const json = await res.json();
    console.log('  Route Handler Status:', res.status);
    console.log('  Route Handler Response Body:', JSON.stringify(json, null, 2));

    if (res.status !== 201 || !json.success) {
      console.error('\n❌ FATAL: API failed to return HTTP 201 Created or success: true.');
      process.exit(1);
    }
    apiResponseData = json.data;
    returnedId = json.data?.id;
  }

  console.log('\n[Step 1 Verification: API Return Shape]');
  console.log('  Returned ID:', returnedId);
  console.log('  Is valid UUID:', isValidUuid(returnedId));
  console.log('  Returned workspace_id:', apiResponseData?.workspace_id);

  if (!returnedId || !isValidUuid(returnedId)) {
    console.error('\n❌ FATAL: API did not return a valid UUID for intelligence card.');
    process.exit(1);
  }

  // 3. READ DIRECTLY FROM SUPABASE DATABASE TABLE public.intelligence_cards
  console.log('\n[Step 2 Verification: Direct Supabase Database Query]');
  console.log(`  Executing: SELECT * FROM public.intelligence_cards WHERE id = '${returnedId}';`);

  const { data: dbRow, error: queryError } = await supabase
    .from('intelligence_cards')
    .select('*')
    .eq('id', returnedId)
    .maybeSingle();

  console.log('  Supabase Query Result:', {
    found: Boolean(dbRow),
    dbRowId: dbRow?.id,
    queryError: queryError ? queryError.message : null
  });

  if (queryError) {
    console.error('\n❌ FATAL: Error querying Supabase table public.intelligence_cards:', queryError);
    process.exit(1);
  }

  if (!dbRow) {
    console.error('\n❌❌❌ CRITICAL FAILURE ❌❌❌');
    console.error(`The API reported success: true with id '${returnedId}',`);
    console.error(`BUT 'SELECT * FROM public.intelligence_cards WHERE id = \'${returnedId}\';' RETURNED ZERO ROWS.`);
    console.error('The row was NOT persisted to Supabase database!');
    process.exit(1);
  }

  // 4. Verify persisted row contents
  console.log('\n[Step 3 Verification: Column Data Integrity]');
  const matchesWorkspace = dbRow.workspace_id === CANONICAL_DEFAULT_WORKSPACE_ID;
  const matchesLanguage = dbRow.exact_language === testExactLanguage;
  const matchesSource = dbRow.source_type === 'runtime_integration_test';

  console.log('  workspace_id matches canonical UUID:', matchesWorkspace, `(${dbRow.workspace_id})`);
  console.log('  exact_language matches payload:', matchesLanguage);
  console.log('  source_type matches payload:', matchesSource);

  if (!matchesWorkspace || !matchesLanguage || !matchesSource) {
    console.error('\n❌ FATAL: Data stored in Supabase row does not match what was submitted.');
    process.exit(1);
  }

  // 5. Cleanup test record
  console.log('\n[Step 4: Cleanup]');
  const { error: deleteError } = await supabase
    .from('intelligence_cards')
    .delete()
    .eq('id', returnedId);

  if (deleteError) {
    console.warn('  Warning: Could not clean up test record:', deleteError.message);
  } else {
    console.log('  ✓ Test record successfully cleaned up from Supabase.');
  }

  console.log('\n================================================================');
  console.log('✅ SUCCESS: Intelligence Card verified persisted in REAL Supabase!');
  console.log(`✅ Project Hostname: ${hostname}`);
  console.log(`✅ Canonical Workspace UUID: ${CANONICAL_DEFAULT_WORKSPACE_ID}`);
  console.log('================================================================\n');
}

runLivePersistenceVerification().catch(err => {
  console.error('Unhandled verification error:', err);
  process.exit(1);
});
