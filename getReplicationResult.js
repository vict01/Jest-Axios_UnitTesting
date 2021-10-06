const REPLICATION_STATUSES = {
  pending: "PENDING",
  initialized: "INITIALIZED",
  failed: "FAILED",
};

const maxNumberOfReplicationRetries = 5;

class ApiClient {
  /**
   * Method used for fetching replication status from the provided endpoint
   * @param replicationHandlerId - string
   * @param endpoint - url string
   * @param webClient - client for sending get requests to provided endpoint
   * @returns response from get request
   * @private
   */

  async _getReplicationResult(replicationHandlerId, endpoint, webClient) {
    if (!replicationHandlerId) {
      throw Error("Unable to start replication, handler id undefined.");
    }

    let replicationResponse = {
      status: REPLICATION_STATUSES.pending,
    };

    let retries = 0;

    do {
      retries++;
      await this.sleepForMilliseconds(5 * 1000);
      try {
        /* expected response format
                {
                data: {}
                status: String
                }
                * */
        replicationResponse = await webClient.get(endpoint);

        logger.debug(
          `Replication result status: ${replicationResponse.data.status}`
        );

      } catch (e) {
        if (retries === maxNumberOfReplicationRetries) {
          throw e;
        }
      }      
    } while (
      replicationResponse.status === REPLICATION_STATUSES.pending// ||
      // replicationResponse.status === REPLICATION_STATUSES.initialized
    );

    if (replicationResponse.status === REPLICATION_STATUSES.failed) {
      throw Error(
        `Replication failed. Reason: ${replicationResponse.data.message}.`
      );
    }

    return replicationResponse.data;
  }

  async sleepForMilliseconds(milliseconds) {
    await new Promise((r) => setTimeout(r, milliseconds));
  }
}

module.exports = {
  ApiClient,
  REPLICATION_STATUSES,
  maxNumberOfReplicationRetries,
};
