import { Component, Input, OnInit } from '@angular/core';
import { StudentService } from './services/student.service';


export interface hypo{
  ipsUbisoft: number;
  ipsKotlin: number;
  ipsWindows: number;
  ipsLicence: number;
  ipsEntrepreneur: number;
  astreSTMicro: number;
  astreAssembleur: number;
  astreLinux: number;
  astreCPGE: number;
  astreEntrepreneur: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})





export class AppComponent implements OnInit {
   Eleve: any[] = [];


  // Hypotheses configuration
  hypotheses:hypo = {
    ipsUbisoft: 8,
    ipsKotlin: 7,
    ipsWindows: 4,
    ipsLicence: 6,
    ipsEntrepreneur: 4,
    astreSTMicro: 9,
    astreAssembleur: 5,
    astreLinux: 8,
    astreCPGE: 5,
    astreEntrepreneur: 2,
  };

  scoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Dropdown values

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStudentData().subscribe((data) => {
      this.Eleve = data.map((student) => ({
        ...student,
        score_ips: Number(this.calculateIPS(student)), // Forcer en nombre
        score_astre: Number(this.calculateASTRE(student)), // Forcer en nombre
      }));
    });
  }

  calculateIPS(student: any): number {
    let score = 0;
    if (student.companies?.includes('Ubisoft')) score += Number(this.hypotheses.ipsUbisoft); // Convertir en nombre
    if (student.languages?.includes('Kotlin')) score += Number(this.hypotheses.ipsKotlin);
    if (student.os?.includes('Windows')) score += Number(this.hypotheses.ipsWindows);
    if (student.education?.includes('Licence')) score += Number(this.hypotheses.ipsLicence);
    if (student.entrepreneur === 'Oui') score += Number(this.hypotheses.ipsEntrepreneur);
    return score;
  }
  
  calculateASTRE(student: any): number {
    let score = 0;
    if (student.companies?.includes('STMicroelectronics')) score += Number(this.hypotheses.astreSTMicro);
    if (student.languages?.includes('Assembleur')) score += Number(this.hypotheses.astreAssembleur);
    if (student.os?.includes('Linux')) score += Number(this.hypotheses.astreLinux);
    if (student.education?.includes('CPGE')) score += Number(this.hypotheses.astreCPGE);
    if (student.entrepreneur === 'Non') score += Number(this.hypotheses.astreEntrepreneur);
    return score;
  }
  

 
  updateScores(): void {

    

    // Recalculate scores for both IPS and ASTRE
    this.Eleve = this.Eleve.map((eleve) => ({
      ...eleve,
      score_ips: this.calculateIPS(eleve) ,
      score_astre: this.calculateASTRE(eleve), // Recalculate ASTRE scores
    }));


    console.log(this.Eleve.map((eleve) => ({
      ...eleve,
      score_ips: this.calculateIPS(eleve) ,
      score_astre: this.calculateASTRE(eleve), // Recalculate ASTRE scores
    })));
    //console.log(this.Eleve.)

    // Update the chart
  }
  calculatePercentage(ips: number, astre: number, type: 'IPS' | 'ASTRE'): number {
    const total = ips + astre;
    if (total === 0) return 0; // Avoid division by zero
    return type === 'IPS' ? Math.round((ips / total) * 100) : Math.round((astre / total) * 100);
  }
  
}
