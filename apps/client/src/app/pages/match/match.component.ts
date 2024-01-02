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
  ) {}

  isUserChosed: boolean = true;
  match?: Match = undefined;
  isInviteModalOpen = false;
  selectedCard = -1;
  areCardsRevealed = false;

  ngOnInit(): void {
    this.matchService.getMatch().subscribe((match) => {
      this.match = match;
    });

    this.matchService.getAreCardsRevealed().subscribe((areCardsRevealed) => {
      this.areCardsRevealed = !areCardsRevealed ?? false;
    });
  }

  get name() {
    return this.match?.name;
  }

  handleUserChoose(data: { name: string; mode: string }) {
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
    if (this.selectedCard === -1) {
      this.selectedCard = card;
      this.matchService.selectCard(card);
    }
  }

  get isUserPlayer() {
    return true;
  }

  get isCardDeckModalOpen() {
    return this.selectedCard === -1 && this.isUserChosed && this.isUserPlayer;
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
