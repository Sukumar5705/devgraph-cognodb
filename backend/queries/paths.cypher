MATCH p = shortestPath(
  (d:Developer {username: $username})-[*1..6]-(t:Technology {normalizedName: $technology})
)
RETURN p
LIMIT 1
