import { isDay, isNight } from "@common/gameLogic";
import { Game } from "@common/model";

export function getGameStateText(game: Game): string {
  switch (game.stage) {
    case "setup":
      return "Setup Players";
    case "active": {
      if (isDay(game)) {
        return `Day ${game.phase.dayNumber}`;
      } else if (isNight(game)) {
        return `Night ${game.phase.nightNumber}`;
      }
      return "";
    }
    case "finished":
      return game.winningTeam === "good" ? "Good Wins!" : "Evil Wins...";
  }
}
