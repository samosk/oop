import { Implementation, type Hiscores } from "$lib/do_not_modify/hiscores";
import type { Leaderboard } from "$lib/do_not_modify/leaderboard";
import { JumpPlayer } from "$lib/do_not_modify/player";
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
import { JumpScore, type Score } from "$lib/do_not_modify/score";

// LEADERBOARD IS REPRESENTED AS A MAP OF KEY - VALUE PAIRS
// THE KEY IS THE LEADERBOARD_ID, THE VALUE IS THE LEADERBOARD ITSELF
// WE CAN LATER USE SET/GET/DELETE TO CRATE/READ/DELETE LEADERBOARDS
// WE CAN GET THE LEADERBOARD TO GET THE SCORES AND UPDATE THE SCORES
let leaderboards: Map<string, Leaderboard> = new Map<string, Leaderboard>();

export class InMemoryHiscores implements Hiscores {
  implementation: Implementation = Implementation.INMEMORY;

  async get_leaderboards(
    request: GetLeaderboardsRequest
  ): Promise<GetLeaderboardsResponse> {
    // NO NEED TO TOUCH THIS. IMPLEMENTATION FINISHED
    // THE RESPONSE SHOULD RETURN THE IDS FOR ALL LEADERBOARDS
    // GETTING THE KEYS FOR THE MAP GETS THE IDS FOR THE LEADERBOARDS

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

    // OTHERWISE CREATE A NEW LEADERBOARD AND SET THE NEW LEADERBOARD
    // TO THE MAP OF LEADERBOARDS USING THE LEADERBOARD ID
    // IN SOME WAY YOU NEED TO KEEP TRACK OF THE SETTING save_multiple_scores_per_player
    // SO THAT YOU CAN IMPLEMENT THE CORRECT LOGIC FOR THE SCORE SUBMISSIONS
    // RETURN SUCCESS TRUE IF SUCCESSFUL




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

    // OTHERWISE GET THE LEADERBOARD USING THE LEADERBOARD ID
    // THEN GET THE SCORES FROM START_INDEX -> END_INDEX
    // MAKE SURE TO SORT THE SCORES FIRST FROM HIGHEST TO LOWEST
    // RETURN SUCCESS TRUE IF SUCCESSFUL AND THE SCORES


  }
  async submit_score_to_leaderboard(
    request: SubmitScoreRequest
  ): Promise<SubmitScoreResponse> {
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



    // TODO: CHECK IF PROVIDED LEADERBOARD_ID EXISTS
    // IF IT DOESNT EXIST RETURN SUCCESS FALSE

    // OTHERWISE GET THE LEADERBOARD USING THE LEADERBOARD ID
    // ADD THE SCORE TO THE LEADERBOARD
    // REMEMBER HERE TO TAKE INTO CONSIDERATION IF THE LEADERBOARD HAS BEEN CONFIGURED TO ONLY
    // SAVE ONE SCORE PER USER.
    // LOGICALLY IF IT ONLY MAINTAINS THE HIGHEST SCORE MAKE SURE TO JUST SAVE THE HIGHEST SCORE
    // PROBABLY RETURN SUCCESS FALSE IF IT ONLY SAVES ONE SCORE AND THE SUBMITTED SCORE WAS LOWER THAN PREVIOUS HIGH
    // RETURN SUCCESS TRUE IF SUCCESSFUL AND THE RANK THE SCORE RECIEVED WHEN BEING SUBMITTED
    // THE RANK CONTAINS THE LEADERBOARD ID, THE SCORE AND THE INDEX OF THE SCORE IN THE LEADERBOARD LIST OF SCORES

    // YOU MIGHT CONSIDER SORTING THE SCORES HERE INSTEAD OF WHEN RETURNING SCORES, UP TO YOU.

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
    //For loop over leaderboards, inner loop over scores inside the leaderboards
    // FOR EACH LEADERBOARD ITERATE OVER ALL THEIR SCORES. THIS MEANS TWO NESTED LOOPS, AN OUTER OF ALL LEADERBOARDS
    // AND AN INNER LOOP OVER THE LEADERBOARD SCORES.
    // IF A PLAYER SCORE IS DETECTED USING THE PROVIDED PLAYER_ID, GET THE RANK FOR THE SCORE
    // THE RANK CONTAINS THE LEADERBOARD ID THE SCORE WAS FOUND IN, THE SCORE ITSELF AND THE
    // INDEX OF THE SCORE IN THE LEADERBOARD LIST OF SCORES
    const response: GetRanksForPlayerResponse = {
      success: true, ranks: rank
    }
    return response;
  }
}