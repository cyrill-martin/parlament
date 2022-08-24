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

        # print(f"Requesting data for {c['firstName']} {c['lastName']}")
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

    with open(f"{council}_council.json", "w", encoding="utf-8") as file:
      json.dump(
        members, 
        file, 
        ensure_ascii=False, 
        indent=4
      )

  else: 
    print("Requesting the councillors overview didn't work")

if __name__ == "__main__":
  get_councillors("N")