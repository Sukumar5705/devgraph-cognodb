MATCH (d:Developer {username: $username})
-[:CONTRIBUTES_TO]->(:Repository)
-[:USES_TECHNOLOGY]->(t:Technology)
<-[:USES_TECHNOLOGY]-(:Repository)
<-[:CONTRIBUTES_TO]-(other:Developer)
WHERE other.username <> $username
WITH other, collect(DISTINCT t.name) AS sharedTechnologies
RETURN
other.username AS username,
sharedTechnologies,
size(sharedTechnologies) AS sharedCount
ORDER BY sharedCount DESC
LIMIT $limit
