import orchestrator from "tests/orchestrator.js";

let exerciseId;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.waitForTable("exercises");
  exerciseId = await dummyExercise({
    name: "Triceps Frances",
    reps: "12",
    rest_seconds: 45,
  });
});

async function dummyExercise(exerciseObj) {
  const responsePost = await fetch("http://localhost:3000/api/v1/exercises", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exerciseObj),
  });

  const responseBodyPost = await responsePost.json();
  const dummyExerciseId = responseBodyPost.id;
  return dummyExerciseId;
}

describe("PUT /api/v1/exercises", () => {
  describe("Anonymous user", () => {
    test("Updating an exercise", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/exercises?id=${exerciseId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reps: "16-13-10-7",
            rest_seconds: 90,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(typeof responseBody).toBe("object");
      expect(responseBody.message).toBe("Exercise updated successfully");
    }, 5000);
  });
});
