import json
import requests


def get_councillors(council):
    """
      This functions pulls the available councillor metadata from ws-old.parlament.ch
      and saves it as JSON. Pass "N" or "S" to indicate pulling the National Councils
      or the Council of States 
      :param council: string
    """

    base_url = "http://ws-old.parlament.ch"

    headers = {
        "Accept": "application/json"
    }

    response = requests.get(
        f"{base_url}/councillors/basicdetails",
        headers=headers
    )

    if response.status_code == 200:
        councillors = response.json()

        members = []

        for c in councillors:
            if c["council"] == council:

                print(c["id"])

                c_response = requests.get(
                    f"{base_url}/councillors/{c['id']}",
                    headers=headers
                )

                if c_response.status_code == 200:
                    councillor = c_response.json()

                    members.append(councillor)

                else:
                    print(f"Requesting councillor {c['id']} didn't work")

        members = sorted(members, key=lambda d: d["firstName"])
        return members

    else:
        print("Requesting the councillors overview didn't work")

def make_unique_councillors(members):
    unique_data = {}
    for councillor in members:
      unique_data[councillor["id"]] = councillor

    unique_councillors = list(unique_data.values())
    return unique_councillors

def save_councillors(council, members):
    with open(f"{council}_council.json", "w", encoding="utf-8") as file:
        json.dump(
            members,
            file,
            ensure_ascii=False,
            indent=4
        )

def get_current_councillors(council): 
    councillors = get_councillors(council)
    unique_councillors = make_unique_councillors(councillors)
    save_councillors(council, unique_councillors)

if __name__ == "__main__":
    get_current_councillors("N")
    get_current_councillors("S")
