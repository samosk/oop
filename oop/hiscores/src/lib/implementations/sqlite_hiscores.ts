import { Implementation, type Hiscores } from "$lib/do_not_modify/hiscores";
import type { Leaderboard } from "$lib/do_not_modify/leaderboard";
import { JumpPlayer } from "$lib/do_not_modify/player";
import { JumpScore } from "$lib/do_not_modify/score";
import { DefaultRank, type Rank } from "$lib/do_not_modify/rank";
import type {
  GetLeaderboardsRequest,
  GetLeaderboardsResponse,
  CreateLeaderboardRequest,
  CreateLeaderboardResponse,
  DeleteLeaderboardRequest,
  DeleteLeaderboardResponse,
  GetScoresRequest,
  GetScoresResponse,
  SubmitScoreRequest,
  SubmitScoreResponse,
  GetRanksForPlayerRequest,
  GetRanksForPlayerResponse,
} from "$lib/do_not_modify/requests";
let leaderboards: Map<string, Leaderboard> = new Map<string, Leaderboard>();


export class SQLiteHiscores implements Hiscores {
  implementation: Implementation = Implementation.SQLITE;

  async get_leaderboards(
    request: GetLeaderboardsRequest
  ): Promise<GetLeaderboardsResponse> {
    // TODO: implement logic
    // helloing

    console.log("GetLeaderboardsResponse");
    console.log(request);

    const response: GetLeaderboardsResponse = {
      success: true,
      leaderboards: [...leaderboards.keys()],
    };

    return response;
  }
  async create_leaderboard(
    request: CreateLeaderboardRequest
  ): Promise<CreateLeaderboardResponse> {
    // TODO: implement logic
    if (leaderboards.has(request.leaderboard_id)) {
      const response: CreateLeaderboardResponse = {
        success: false,
      };
      return response
    }
    leaderboards.set(request.leaderboard_id, { id: request.leaderboard_id, scores: [] })

    console.log("CreateLeaderboardRequest");
    console.log(request);

    // TODO: CHECK IF PROVIDED LEADERBOARD_ID ALREADY EXISTS
    // IF IT EXISTS RETURN SUCCESS FALSE


    if (!leaderboards.has(request.leaderboard_id)) {
      const response: CreateLeaderboardResponse = {
        success: false,
      };
      return response;
    } else {
      const response: CreateLeaderboardResponse = {
        success: true,
      };
      return response;
    }
  }
  async delete_leaderboard(
    request: DeleteLeaderboardRequest
  ): Promise<DeleteLeaderboardResponse> {
    // TODO: implement logic
    if (!leaderboards.has(request.leaderboard_id)) {
      const response: DeleteLeaderboardResponse = {
        success: false,
      };
      return response
    }
    leaderboards.delete(request.leaderboard_id)

    console.log("DeleteLeaderboardRequest");
    console.log(request);

    // TODO: CHECK IF PROVIDED LEADERBOARD_ID EXISTS
    // IF IT DOESNT EXISTS RETURN SUCCESS FALSE

    // OTHERWISE DELETE THE LEADERBOARD FROM THE MAP OF LEADERBOARDS USING LEADERBOARD ID
    // RETURN SUCCESS TRUE IF SUCCESSFUL

    if (!leaderboards.has(request.leaderboard_id)) {
      const response: DeleteLeaderboardResponse = {
        success: false,
      };
      return response;
    } else {
      const response: DeleteLeaderboardResponse = {
        success: true,
      };
      return response;
    }
  }
  async get_scores_from_leaderboard(
    request: GetScoresRequest
  ): Promise<GetScoresResponse> {
    // TODO: implement logic

    if (!leaderboards.has(request.leaderboard_id)) {
      const response: GetScoresResponse = {
        success: false,
        scores: []
      };
      return response;
    }
    leaderboards.get(request.leaderboard_id);
    console.log("GetScoresRequest");
    console.log(request);

    // TODO: CHECK IF PROVIDED LEADERBOARD_ID EXISTS
    // IF IT DOESNT EXIST RETURN SUCCESS FALSE
    const leaderboard = leaderboards.get(request.leaderboard_id);
    if (leaderboard == undefined) {
      const response: GetScoresResponse = {
        success: false, scores: []
      };
      return response;
    }

    console.log(leaderboard)
    const sorted = leaderboard.scores.sort((a, b) => b.value - a.value).slice(request.start_index, request.end_index);
    console.log(sorted)
    const response: GetScoresResponse = {
      success: true,
      scores: sorted
    }


    return response;
  }
  async submit_score_to_leaderboard(
    request: SubmitScoreRequest
  ): Promise<SubmitScoreResponse> {
    // TODO: implement logic
    const leaderboard = leaderboards.get(request.leaderboard_id)
    if (leaderboard == null) {
      const response: SubmitScoreResponse = {
        success: false,
        rank: new DefaultRank(
          0,
          request.leaderboard_id,
          new JumpScore(request.score.value, new Date(), new JumpPlayer(request.score.player.id, 9000))
        ),
      };
      return response;
    }

    console.log("SubmitScoreRequest");
    console.log(request);
    leaderboard.scores.push(request.score)
    leaderboard.scores.sort((a, b) => b.value - a.value);
    const sortedIndex = leaderboard.scores.indexOf(request.score)



    const response: SubmitScoreResponse = {
      success: true,
      rank: new DefaultRank(
        sortedIndex,
        request.leaderboard_id,
        new JumpScore(request.score.value, new Date(), new JumpPlayer(request.score.player.id, 9000))
      ),
    };
    return response;
  }
  async get_all_ranks_for_player(
    request: GetRanksForPlayerRequest
  ): Promise<GetRanksForPlayerResponse> {
    // TODO: implement logic
    let rank: Rank[] = [];
    console.log("GetRanksForPlayerRequest");
    console.log(request);
    if (!leaderboards) {
      const response: GetRanksForPlayerResponse = {
        success: false,
        ranks: [],
      }
      return response;
    } else {
      leaderboards.forEach(function (leaderboards) {
        leaderboards.scores.forEach((e, index) => {
          if (request.player_id == e.player.id) {
            rank.push(new DefaultRank(index, leaderboards.id, e))
            rank.sort((a, b) => a.index - b.index);
            // const sortedIndex = rank.indexOf(rank.index)

            // rank = new DefaultRank(index, leaderboards.id, e);


          }
        })
      });
    }

    const response: GetRanksForPlayerResponse = {
      success: true, ranks: rank
    }
    return response;
  }
}
