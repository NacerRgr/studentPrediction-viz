import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private csvUrl = 'assets/students.csv'; // Path to the CSV file

  constructor(private http: HttpClient) {

    // console.log("helll")

  }

  getStudentData(): Observable<any[]> {

    // console.log("www")

    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map((csvData) => {
        const filteredData: any[] = [];
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            result.data.forEach((row: any) => {
              // Keep only the necessary columns
              filteredData.push({
                student_id: row['Numero etudiant '],
                companies: row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '],
                languages: row['12. Quels sont les langages informatiques que tu as pratiqué? '],
                os: row['18. Quel(s) système(s) d’exploitation utilises-tu ? '],
                education: row['7. Quelle(s) est/sont ta/tes formation(s) antérieure(s) ? '],
                entrepreneur: row['9. Envisages-tu l’auto-entreprenariat ? '],
              });
            });
          },
        });

        console.log(filteredData)
        return filteredData;
      })
    );
  }
}
