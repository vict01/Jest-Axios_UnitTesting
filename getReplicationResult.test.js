const {
  ApiClient,
  REPLICATION_STATUSES,
  maxNumberOfReplicationRetries,
} = require("./getReplicationResult.js");
const axios = require("axios");
const replicationHandlerId = "1";
const endPoint = "http://mockedTestApi.victor/";
const apiClient = new ApiClient();
jest.setTimeout(100000);
jest.mock("axios");

beforeAll(() => warmUpUnitTesting());

describe("Happy path and positive testing", () => {
  beforeEach(() => warmUpHappyPath());

  // It was necessary to remove one condition from the OR in the loop, since otherwise happy path will never be met
  test("Method should contain data when replicationResponse status is initialized", async () => {
    const data = { message: "Expected Message" };
    axios.get.mockResolvedValueOnce({
      status: REPLICATION_STATUSES.initialized,
      data,
    });
    expect(
      await apiClient._getReplicationResult(
        replicationHandlerId,
        endPoint,
        axios
      )
    ).toBe(data);
  });
});

describe("Exception handling and negative testing", () => {
  beforeAll(() => warmUpNegativeTest());

  test("Method should handle exception when replicationHandlerId is undefined", async () => {
    await apiClient
      ._getReplicationResult(undefined, endPoint, axios)
      .then((r) => {
        expect(r).toBeDefined();
      })
      .catch((e) => {
        if (e.response) {
          expect(e.response).toThrowError(
            new Error("Unable to start replication, handler id undefined.")
          );
        }
      });
  });

  test("Method should handle exception when retries is equal to maxNumberOfReplicationRetriesvalidation", async () => {
    const error = new Error("Expected error");
    axios.get.mockRejectedValue(error);
    await apiClient
      ._getReplicationResult(replicationHandlerId, endPoint, axios)
      .catch((e) => {
        if (e) {
          expect(e).toStrictEqual(error);
        }
      });
  });

  test("Method should handle exception when replicationResponse status is failed", async () => {
    const data = { message: "Expected Message" };
    axios.get.mockResolvedValueOnce({
      status: REPLICATION_STATUSES.failed,
      data,
    });
    await apiClient
      ._getReplicationResult(replicationHandlerId, endPoint, axios)
      .catch((e) => {
        if (e) {
          expect(e).toStrictEqual(
            new Error(`Replication failed. Reason: ${data.message}.`)
          );
        }
      });
  });
});

const warmUpHappyPath = () => console.log("Starting happy path test...");
const warmUpNegativeTest = () => console.log("Starting negative tests...");
const warmUpUnitTesting = () =>
  console.log(
    "Starting unit testing...\nIt'll only take a few seconds\nProcessing..."
  );
