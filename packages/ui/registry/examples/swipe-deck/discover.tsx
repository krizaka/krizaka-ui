"use client";

import { Badge } from "@krizaka/ui/badge";
import { PersonCard, SwipeDeck } from "@krizaka/ui/swipe-deck";
import { VerifiedBadge } from "@krizaka/ui/verified-badge";
import { useState } from "react";

const png = (data: string) => `data:image/png;base64,${data}`;
const PEOPLE = [
  { id: "e", name: "Elena", age: 29, km: 3.2, bio: "Sunsets, vinyl and long walks.", tags: ["Music", "Surf"], photos: [png("iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAIAAACtAwlQAAABaklEQVR42mWMy24UQQxF7arqlwLhIbJhwZZf5I/4IISEBIsIRSKTMOmZnp7uqrJ9zYIeIeCsrqzjw+vHDwYCCM6wbfy5gABKatsysJqLuoHciZ2dGE4ApSrbnyidVn06lVyQUrweur5pmAJAqVQGSEGnRb79mD5/H6dzuRq6929fv7t5MTSd+6VUK3Zj/XQ7frkblyJ926jwkIab6yZw3Eq58rzaz6nMq1RVA+3nMmd73nMMfCkJiRBA7u5O7g6QCFfhyLyVRJg89U3bxKiGJsQ+te6pCge+lETYPT3rujalotqkNLSdexRhJk6lshjOWXeH+WE6Z1HAi+p+Pr+czuxtG0PKlZesd+P09f5xd5iKqrlX1cfpGCiqhDdXr9Ja8DSX24f9/eG4VDGAiAzIIrvpwJ6C96FUXrId15Ivxm8MKCpzKUvRUCpXJTOHO/2Nu6uhqocqLMr4V9iAkxoHMzZjgP7XnMjBZvQLMEROG5iV3IMAAAAASUVORK5CYII="), png("iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAIAAACtAwlQAAABZklEQVR42m3MzW4TUQyGYZ8zZzJpwp8UiQ0SEvfMLXETICqoKrXQdDohyZwZ258/FpPCAryyrUdv6j99ZDAiSALLFhFkULhcLAAWFEEA7ggEhYkiImQwWNx84WY+Vh0OZzVvcn657bq25MQIFlOLYCDOY/1+23/59uN0mrZX3Yf3u3dvX6+7VvhcMvXH/vT5+u7rzcM02XrVOvyqbXZvNjmlYmoMqtpY5+EwjqOae4CHX7XWWTerktOl5OYwR5AkKSSXp6sxP5fcPJHrVWlLA0Rpctc2iYQ5/5RgEHLTlbY0qt6WZrsuQrp5SlJMzRG16r4/98M4qyM4m/eH+mqzyilWTVNUfZr0bn+8vn16eDqqeZDm2A9jEgawe7Eu8zQPx+nmfrh/PNbZERQRBCf1n0NtkhQym/lU59N5nu0ilkFQDaeqddLsamZwB/+Cy5CEhzuym8M9KP8iEQkSjgwAAP9LhCQB/AYQ5Y+kAv/RXgAAAABJRU5ErkJggg==")] },
  { id: "n", name: "Noah", age: 31, km: 12, bio: "Cook, climber, bad puns.", tags: ["Climbing"], photos: [png("iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAIAAACtAwlQAAABaUlEQVR42mWRzW5TQRSDZ+bOTdMoFMGCFWx4SR6OF0EgQVWECmqbNOnNvTPnHNssIn6kemVZn+yF84eP30mKFEWCZwMmnROKrAAIShSIAOECKaWUkhIlkTXMzxDdbT614z7M8jCsNi+G8UI5nyEjKKKfpuOP6931Z5uO4+X26t377Zu3w2otqYY5SZjNu/uHr5/2N1+it7paR0QZLy9evs651DAjCes2n9ph58uMcIH9+Njn07De5jL8bXJ4kJSUJEkU4BFmuQzVzUTCXUplXJdhJFCGWuqFlMIjJ1aYE0SEpLrelDpmtzKMw2ojJpinnGuYMcLavOzv2+MDrItAdHvatc3VKqUyjDV697YsD7fT7bf2eIewJCK8H+6VMoBx86paa/1pP/26WXY/oy+JSCklAt774U65kLm4mS/N5+k8lP5IBMJimaK1AnO6E5HOf/0vSQGElzBHhEilZ1ASRXgUAAD0vOYfhd832o14udpJswAAAABJRU5ErkJggg==")] },
];

// Discover: drag right to like, left to pass, the buttons, or ← → on the focused deck.
export default function SwipeDeckDiscover() {
  const [people, setPeople] = useState(PEOPLE);
  return (
    <SwipeDeck
      items={people}
      getId={(p) => p.id}
      getName={(p) => p.name}
      onSwipe={(p) => setPeople((all) => all.filter((x) => x.id !== p.id))}
      labels={{ like: "Like", pass: "Pass", deck: "Profiles. Right arrow to like, left arrow to pass.", likeStamp: "Like", passStamp: "Nope" }}
      renderCard={(p) => (
        <PersonCard
          photos={p.photos.map((src) => ({ src }))}
          name={p.name}
          age={p.age}
          badge={<VerifiedBadge label="Verified" onMedia size="lg" />}
          meta={<span className="text-xs font-semibold">{`${p.km} km away`}</span>}
          bio={p.bio}
          footer={p.tags.map((t) => <Badge key={t} tone="scrim">{t}</Badge>)}
        />
      )}
    />
  );
}
