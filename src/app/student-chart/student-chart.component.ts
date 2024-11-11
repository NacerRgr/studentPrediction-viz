import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartType, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-student-chart',
  templateUrl: './student-chart.component.html',
  styleUrls: ['./student-chart.component.css'],
})
export class StudentChartComponent implements OnChanges {
  @Input() students: any[] = []; // Input data from parent
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart!: Chart; // Chart.js instance

  constructor() {
    Chart.register(...registerables); // Register Chart.js components
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['students'] && this.students.length > 0) {
      this.renderChart(); // Re-render chart when students data changes
    }
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart to avoid duplication
    }

    const labels = this.students.map((student) => student.student_id); // Student IDs
    const ipsScores = this.students.map((student) => student.score_ips); // IPS Scores
    const astreScores = this.students.map((student) => student.score_astre); // ASTRE Scores

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels,
        datasets: [
          {
            label: 'Score IPS',
            data: ipsScores,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Score ASTRE',
            data: astreScores.map((score) => -score), // Use negative values for ASTRE
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Students',
            },
          },
          y: {
            ticks: {
              callback: function (value) {
                return Math.abs(Number(value)).toString(); // Display positive values on Y-axis
              },
            },
            title: {
              display: true,
              text: 'Scores',
            },
            beginAtZero: true,
          },
        },
      },
    };

    // Create the chart
    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }
}
