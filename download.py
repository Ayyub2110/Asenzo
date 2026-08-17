import sys
import urllib.request

url = sys.argv[1]
output = sys.argv[2]
try:
    urllib.request.urlretrieve(url, output)
    print(f"Downloaded to {output}")
except Exception as e:
    print(f"Error: {e}")
