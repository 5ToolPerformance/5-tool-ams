ALTER TABLE "lesson_assessments"
ALTER COLUMN "created_on"
SET DATA TYPE timestamp
USING "created_on" AT TIME ZONE 'UTC';

ALTER TABLE "player_information"
ADD COLUMN "date_of_birth_new" DATE;

UPDATE "player_information"
SET "date_of_birth_new" = "date_of_birth"::date
WHERE "date_of_birth" IS NOT NULL;

ALTER TABLE "player_information" DROP COLUMN "date_of_birth";
ALTER TABLE "player_information" RENAME COLUMN "date_of_birth_new" TO "date_of_birth";