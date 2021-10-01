import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payements',
  templateUrl: './payements.component.html',
  styleUrls: ['./payements.component.scss']
})
export class PayementsComponent implements OnInit {

  criptoName = [
    {
      name: 'select the  cripto'
    },
    {
      name: 'Bitcoin'
    },
    {
      name: 'USDT'
    },
    {
      name: 'Ethereum'
    },
    {
      name: 'Bitcoin Cash'
    }
  ]


  criptoSelected: any = this.criptoName[0].name

  criptoWalletteName = 'cripto'

  constructor() { }

  ngOnInit(): void {

  }

  onSelectCripto(criptoSelected: any) {
    if (this.criptoSelected == 'select the  cripto') {
      this.criptoWalletteName = 'cripto'
    } else {
      this.criptoWalletteName = criptoSelected
    }
  }


}
