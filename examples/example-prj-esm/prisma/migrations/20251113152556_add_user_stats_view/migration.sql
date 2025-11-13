-- CreateView
CREATE VIEW "UserStats" AS
SELECT 
    u."id" as "userId",
    COALESCE(p."postCount", 0) as "postCount",
    COALESCE(c."commentCount", 0) as "commentCount"
FROM "User" u
LEFT JOIN (
    SELECT "authorId", COUNT(*) as "postCount"
    FROM "Post"
    GROUP BY "authorId"
) p ON u."id" = p."authorId"
LEFT JOIN (
    SELECT "authorId", COUNT(*) as "commentCount"
    FROM "Comment"
    GROUP BY "authorId"
) c ON u."id" = c."authorId";