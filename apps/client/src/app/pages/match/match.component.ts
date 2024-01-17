import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Match } from '@planning-poker/models';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
  ) { }

  isUserChosed: boolean = false;
  match?: Match = undefined;
  isInviteModalOpen = false;
  selectedCard: number | null = null;
  areCardsRevealed = false;

  ngOnInit(): void {
    this.matchService.getMatch().subscribe((match) => {
      this.match = match;
    });

    this.matchService.getAreCardsRevealed().subscribe((areCardsRevealed) => {
      this.areCardsRevealed = areCardsRevealed ?? false;
    });

    this.matchService.getSelectedCard().subscribe((selectedCard) => {
      this.selectedCard = selectedCard;
    });
  }

  get name() {
    return this.match?.name;
  }

  handleUserChoose(data: { name: string; mode: "player" | "spectator" }) {
    this.isUserChosed = true;
    this.matchService.joinMatch(
      this.route.snapshot.paramMap.get('id')!,
      data.name,
      data.mode,
    );
  }

  handleInviteModalOpen() {
    this.isInviteModalOpen = true;
  }

  handleInviteModalClose() {
    this.isInviteModalOpen = false;
  }

  onSelectedCard(card: number) {
    if (this.selectedCard === null) {
      this.selectedCard = card;
      this.matchService.selectCard(card);
    }
  }

  get isUserPlayer() {
    return this.match?.players.some((player) => player.id === this.matchService.userId) ?? false;
  }

  get isCardDeckModalOpen() {
    return this.selectedCard === null && this.isUserChosed && this.isUserPlayer;
  }

  get results(): { card: number; votes: number }[] {
    return [
      { card: 3, votes: 1 },
      { card: 5, votes: 1 },
      { card: 13, votes: 3 },
      { card: 21, votes: 2 },
    ];
  }
}
