import json
import requests

base_url = "http://ws-old.parlament.ch"
headers = {
    "Accept": "application/json"
}


def get_basic_details():
    response = requests.get(
        f"{base_url}/councillors/basicdetails",
        headers=headers
    )
    if response.status_code == 200:
        return response.json()
    else:
        print("Couldn't request basic councillor details")


def get_councillors(basic_data, council):
    members = []
    for c in basic_data:
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


def get_current_councillors(basic_data, council):
    councillors = get_councillors(basic_data, council)
    unique_councillors = make_unique_councillors(councillors)
    save_councillors(council, unique_councillors)


if __name__ == "__main__":
    basic_data = get_basic_details()
    get_current_councillors(basic_data, "N")
    get_current_councillors(basic_data, "S")
    