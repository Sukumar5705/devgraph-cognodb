MATCH (d:Developer {username: $username})
OPTIONAL MATCH (d)-[:CONTRIBUTES_TO]->(r:Repository)
OPTIONAL MATCH (r)-[:USES_TECHNOLOGY]->(tech:Technology)
OPTIONAL MATCH (r)-[:HAS_TOPIC]->(topic:Topic)
OPTIONAL MATCH (d)-[:MEMBER_OF]->(o:Organization)
RETURN d AS developer,
       collect(DISTINCT r) AS repositories,
       collect(DISTINCT tech) AS technologies,
       collect(DISTINCT topic) AS topics,
       collect(DISTINCT o) AS organizations
