"""Populates the database with users, events, and entries."""
import sys

sys.path.insert(0, "/home/avashist/secrete_santa_app/src")


import httpx
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from app_v3.api.db.models import UserSignUp

# API_URL = "https://avashist.com"
API_URL = "http://localhost:3000"


@dataclass
class Event:
    """Event dataclass"""

    name: str
    creator: str
    location: str
    limit: int
    price: float
    rsvp_date: str
    event_date: str
    public: bool = True


users = [
    UserSignUp(name="Jerry Seinfeld", email="j_seinfeld@gmail.com", password="j_seinfeld@gmail.com"),
    UserSignUp(name="George Costanza", email="g_costanza@gmail.com", password="g_costanza@gmail.com"),
    UserSignUp(name="Cosmo Kramer", email="c_kramer@gmail.com", password="c_kramer@gmail.com"),
    UserSignUp(name="Elaine Benes", email="e_benes@gmail.com", password="e_benes@gmail.com"),
    UserSignUp(name="Newman", email="newman@gmail.com", password="newman@gmail.com"),
    UserSignUp(name="David Puddy", email="d_puddy@gmail.com", password="d_puddy@gmail.com"),
    UserSignUp(name="J. Peterman", email="j_peterman@gmail.com", password="j_peterman@gmail.com"),
]


def get_date_string(days: int) -> str:
    """Returns a date string in the format from today"""
    date = datetime.now() + timedelta(days=days)
    return date.strftime("%Y-%m-%dT00:00:00.000Z")


events = {
    "j_seinfeld@gmail.com": [Event(
        name="Seinfeld Trivia Night",
        creator="j_seinfeld@gmail.com",
        location="Monk's Cafe",
        limit=5,
        price=5.00,
        rsvp_date=get_date_string(2),
        event_date=get_date_string(5),
    )],
    "g_costanza@gmail.com": [Event(
        name="Yankees Game",
        creator="g_costanza@gmail.com",
        location="Yankee Stadium",
        limit=3,
        price=50.00,
        rsvp_date=get_date_string(3),
        event_date=get_date_string(7),
    )],
    "c_kramer@gmail.com": [Event(
        name="Kramer Dinner Party",
        creator="c_kramer@gmail.com",
        location="Kramer's Apartment",
        limit=8,
        price=0.00,
        rsvp_date=get_date_string(10),
        event_date=get_date_string(15),
    )],
    "e_benes@gmail.com": [Event(
        name="Elaine's Birthday",
        creator="e_benes@gmail.com",
        location="Elaine's Apartment",
        limit=20,
        price=0.00,
        rsvp_date=get_date_string(1),
        event_date=get_date_string(12),
    ), Event(
        name="Elane's Boss Dinner",
        creator="e_benes@gmail.com",
        location="Chinese Restaurant",
        limit=5,
        price=0.00,
        public=False,
        rsvp_date=get_date_string(3),
        event_date=get_date_string(8),
    )],
    "newman@gmail.com": [Event(
        name="Newman's Birthday",
        creator="newman@gmail.com",
        location="Newman's Apartment",
        limit=5,
        price=0.00,
        rsvp_date=get_date_string(5),
        event_date=get_date_string(8),
    )]
}

entries = {
    "Seinfeld Trivia Night": [
        "j_seinfeld@gmail.com",
        "g_costanza@gmail.com",
        "c_kramer@gmail.com",
        "e_benes@gmail.com",
    ],
    "Yankees Game": ["g_costanza@gmail.com", "c_kramer@gmail.com", "newman@gmail.com"],
    "Kramer Dinner Party": [
        "e_benes@gmail.com",
        "c_kramer@gmail.com",
        "d_puddy@gmail.com",
    ],
    "Elaine's Birthday": [
        "j_seinfeld@gmail.com",
        "g_costanza@gmail.com",
        "c_kramer@gmail.com",
    ],
    "Newman's Birthday": ["c_kramer@gmail.com"],
    "Elane's Boss Dinner": [
        "j_seinfeld@gmail.com",
        "g_costanza@gmail.com",
        "j_peterman@gmail.com",
    ],
}


def clean_db():
    """Removes all the users, events, and entries from the database."""

    for user in users:
        print(user.email, user.name)
        res = httpx.post(f"{API_URL}/users/login", json={"email": user.email, "password": user.password})
        print(res)
        if res.status_code == 200 and res.json().get('id', "") != "":
            _id = res.json().get('id')
            _ = httpx.delete(f"{API_URL}/users/{_id}")


def populate_db():
    """Populates the database with users, events, and entries."""
    user_stash = {}
    for user in users:
        res = httpx.post(f"{API_URL}/users/", json=user.model_dump())
        res = httpx.post(f"{API_URL}/users/login", json={"email": user.email, "password": user.password})
        cookies = res.cookies["Authorization"]
        user_stash[user.email] = {"cookies": cookies, "id": res.json().get('id')}

    event_stash = {}
    for _, sub_event in events.items():
        for event in sub_event:
            event_res = httpx.post(
                f"{API_URL}/events/",
                json=asdict(event),
                cookies={"Authorization": user_stash[event.creator]["cookies"]},
            )
            event_stash[event.name] = event_res.json().get('id')
    for event_name, user_email_list in entries.items():
        for user_email in user_email_list:
            httpx.post(
                f"{API_URL}/entries/",
                json={
                    "event_id": event_stash[event_name],
                    "user_email": user_email,
                },
            )


def random_population():
    """Populates the database with users, events, and entries."""
    for user in users:
        res = httpx.post(f"{API_URL}/users/", json=user.model_dump())
        res = httpx.post(f"{API_URL}/users/login", json={"email": user.email, "password": user.password})
        cookies = res.cookies["Authorization"]
        if user.email in events:
            for event in events[user.email]:
                event_res = httpx.post(
                    f"{API_URL}/events/",
                    json=asdict(event),
                    cookies={"Authorization": cookies},
                )
                for entry in entries[event.name]:
                    httpx.post(
                        f"{API_URL}/entries/",
                        json={
                            "event_id": event_res.json().get('id'),
                            "user_email": entry,
                        },
                    )

def main():
    """Main function"""
    clean_db()
    # populate_db()
    random_population()


if __name__ == "__main__":
    main()
