import os
import requests
import time

def set_output(key, value):
    output_file_path = os.getenv("GITHUB_OUTPUT")
    with open(output_file_path, 'a') as file:
        print(f"{key}={value}", file=file)

def ping_url(url, delay, max_trials):
    trials = 0
    while trials < max_trials:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print(f"Website {url} is reachable.")
                return True
        except requests.ConnectionError:
            print(f"Website {url} is not reachable. Retrying in {delay} seconds...")
            time.sleep(delay)
            trials += 1
        except requests.exceptions.MissingSchema:
            print(f"Invalid URL format: {url}. Make sure the URL has a valid schema.")
            return False
    return False

def run():
    website_url = os.getenv("INPUT_URL")
    delay = int(os.getenv("INPUT_DELAY"))
    max_trials = int(os.getenv("INPUT_MAX_TRIALS"))

    website_reachable = ping_url(website_url, delay, max_trials)
    set_output("url-reachable", website_reachable)

    if not website_reachable:
        raise Exception(f"Website {website_url} was malformed or unreachable. Execution failed.")

if __name__ == "__main__":
    run()