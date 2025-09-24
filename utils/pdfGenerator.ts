import { Alert, Platform } from 'react-native';

export interface InterviewAnalysisData {
  voiceScores?: any;
  videoAnalysis?: any;
  textAnalysis?: any;
  aiAdvice?: string;
  percentileAnalysis?: any;
  sessionId?: string;
  timestamp?: string;
}

// 텍스트 분석 결과를 HTML로 변환하는 함수
const generateTextAnalysisHTML = (textAnalysis: any): string => {
  if (!textAnalysis) return '';
  
  let html = '';
  
  // 총평
  if (textAnalysis.overall_summary) {
    html += `
      <div class="text-analysis-section">
        <h3>📋 총평</h3>
        <div class="text-content">${textAnalysis.overall_summary}</div>
      </div>
    `;
  }
  
  // 면접 진행 근거
  if (textAnalysis.interview_flow_rationale) {
    html += `
      <div class="text-analysis-section">
        <h3>🎯 면접 진행 근거</h3>
        <div class="text-content">${textAnalysis.interview_flow_rationale}</div>
      </div>
    `;
  }
  
  // 강점 매트릭스
  if (textAnalysis.strengths_matrix && textAnalysis.strengths_matrix.length > 0) {
    html += `
      <div class="text-analysis-section">
        <h3>💪 강점 매트릭스</h3>
        <div class="matrix-container">
    `;
    textAnalysis.strengths_matrix.forEach((item: any) => {
      html += `
        <div class="matrix-item">
          <div class="matrix-theme">${item.theme}</div>
          <div class="matrix-evidence">근거: ${item.evidence.join(', ')}</div>
        </div>
      `;
    });
    html += `</div></div>`;
  }
  
  // 약점 매트릭스
  if (textAnalysis.weaknesses_matrix && textAnalysis.weaknesses_matrix.length > 0) {
    html += `
      <div class="text-analysis-section">
        <h3>⚠️ 약점 매트릭스</h3>
        <div class="matrix-container">
    `;
    textAnalysis.weaknesses_matrix.forEach((item: any) => {
      const severityColor = item.severity === 'high' ? '#F44336' : 
                           item.severity === 'medium' ? '#FFC107' : '#4CAF50';
      html += `
        <div class="matrix-item">
          <div class="matrix-header">
            <span class="matrix-theme">${item.theme}</span>
            <span class="severity-chip" style="background-color: ${severityColor}">심각도: ${item.severity}</span>
          </div>
          <div class="matrix-evidence">근거: ${item.evidence.join(', ')}</div>
        </div>
      `;
    });
    html += `</div></div>`;
  }
  
  // 점수 집계
  if (textAnalysis.score_aggregation) {
    html += `
      <div class="text-analysis-section">
        <h3>📊 점수 집계</h3>
        <div class="score-aggregation">
          <h4>캘리브레이션</h4>
          <div class="text-content">${textAnalysis.score_aggregation.calibration}</div>
        </div>
      </div>
    `;
  }
  
  // 놓친 기회
  if (textAnalysis.missed_opportunities && textAnalysis.missed_opportunities.length > 0) {
    html += `
      <div class="text-analysis-section">
        <h3>🔍 놓친 기회</h3>
        <ul class="opportunity-list">
    `;
    textAnalysis.missed_opportunities.forEach((op: string) => {
      html += `<li>${op}</li>`;
    });
    html += `</ul></div>`;
  }
  
  // 추가 팔로업 제안
  if (textAnalysis.potential_followups_global && textAnalysis.potential_followups_global.length > 0) {
    html += `
      <div class="text-analysis-section">
        <h3>💡 추가 팔로업 제안</h3>
        <ul class="followup-list">
    `;
    textAnalysis.potential_followups_global.forEach((f: string) => {
      html += `<li>${f}</li>`;
    });
    html += `</ul></div>`;
  }
  
  // 채용 추천
  if (textAnalysis.hiring_recommendation) {
    const recommendationColor = textAnalysis.hiring_recommendation === 'hire' ? '#4CAF50' : '#F44336';
    const recommendationText = textAnalysis.hiring_recommendation === 'hire' ? '채용 추천' : '채용 비추천';
    html += `
      <div class="text-analysis-section">
        <h3>🎯 채용 추천</h3>
        <div class="recommendation-chip" style="background-color: ${recommendationColor}">${recommendationText}</div>
      </div>
    `;
  }
  
  // 다음 액션
  if (textAnalysis.next_actions && textAnalysis.next_actions.length > 0) {
    html += `
      <div class="text-analysis-section">
        <h3>📋 다음 액션</h3>
        <ul class="action-list">
    `;
    textAnalysis.next_actions.forEach((action: string) => {
      html += `<li>${action}</li>`;
    });
    html += `</ul></div>`;
  }
  
  // 이력서 종합 분석 (비어있으면 섹션 숨김)
  if (textAnalysis.full_resume_analysis) {
    const fra = textAnalysis.full_resume_analysis;

    const blocks: string[] = [];
    if (isNonEmpty(fra["심층분석"])) {
      blocks.push(`
          <h4>심층 분석</h4>
          <div class="markdown-content">${generateMarkdownHTML(fra["심층분석"])}</div>`);
    }
    if (isNonEmpty(fra["교차분석"])) {
      blocks.push(`
          <h4>교차 분석</h4>
          <div class="markdown-content">${generateMarkdownHTML(fra["교차분석"])}</div>`);
    }
    if (isNonEmpty(fra["정합성점검"])) {
      blocks.push(`
          <h4>정합성 점검</h4>
          <div class="markdown-content">${generateMarkdownHTML(fra["정합성점검"])}</div>`);
    }
    if (isNonEmpty(fra["NCS요약"])) {
      blocks.push(`
          <h4>NCS 요약</h4>
          <div class="markdown-content">${generateMarkdownHTML(fra["NCS요약"])}</div>`);
    }

    if (blocks.length > 0) {
      html += `
        <div class="text-analysis-section">
          <h3>📄 이력서 종합 분석</h3>
          <div class="resume-analysis">
            ${blocks.join('\n')}
          </div>
        </div>
      `;
    }
  }
  
  // 질문별 상세 피드백 (비어있으면 숨김)
  if (isNonEmpty(textAnalysis.question_by_question_feedback)) {
    const qbqfHtml = textAnalysis.question_by_question_feedback
      .map((qbqf: any) => {
        const detailsHtml = (qbqf.details || [])
          .map((detail: any) => {
            const coachingHtml = detail.coaching && Object.keys(detail.coaching).length
              ? `<div class="qbqf-coaching">${Object.entries(detail.coaching)
                  .map(([k, v]) => `<div class="qbqf-row"><span class="qbqf-label">• ${escapeHtml(String(k))}</span><span class="qbqf-text">${escapeHtml(String(v))}</span></div>`)
                  .join('')}</div>`
              : '';
            return `
              <div class="qbqf-detail">
                <div class="qbqf-row"><span class="qbqf-label">질문</span><span class="qbqf-text">${escapeHtml(detail.question)}</span></div>
                <div class="qbqf-row"><span class="qbqf-label">피드백</span><span class="qbqf-text">${escapeHtml(detail.evaluation?.feedback ?? '')}</span></div>
                ${detail.evaluation?.evidence_quote ? `<div class="qbqf-row"><span class="qbqf-label">근거</span><span class="qbqf-text">${escapeHtml(detail.evaluation.evidence_quote)}</span></div>` : ''}
                ${detail.model_answer ? `<div class="qbqf-row"><span class="qbqf-label">모범답변</span><span class="qbqf-text">${escapeHtml(detail.model_answer)}</span></div>` : ''}
                ${coachingHtml}
              </div>`;
          })
          .join('');
        return `
          <div class="qbqf-item">
            <div class="qbqf-item-header">${escapeHtml(String(qbqf.main_question_id))}. ${escapeHtml(String(qbqf.thematic_summary))}</div>
            ${detailsHtml}
          </div>`;
      })
      .join('');

    html += `
      <div class="qbqf-section">
        <div class="qbqf-title">질문별 상세 피드백</div>
        ${qbqfHtml}
      </div>
    `;
  }
  
  return html;
};

// 마크다운을 HTML로 변환하는 함수 (간단 파서 + 테이블 지원)
const generateMarkdownHTML = (markdown: string): string => {
  if (!markdown) return '';

  // 1) 표 블록을 먼저 HTML 테이블로 변환 (GFM 스타일)
  const lines = markdown.split(/\r?\n/);
  const htmlParts: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 테이블 감지: 파이프(|)가 포함된 헤더 라인 + 다음 라인에 구분 라인
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*[:\-\s|]+\|\s*$/.test(lines[i + 1])) {
      // 헤더 파싱
      const headerCells = line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(c => c.trim());

      // 구분 라인 스킵
      i += 2;

      // 바디 파싱
      const bodyRows: string[][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const row = lines[i]
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(c => c.trim());
        bodyRows.push(row);
        i += 1;
      }

      // 테이블 HTML 생성
      const thead = `<thead><tr>${headerCells.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
        .join('')}</tbody>`;
      htmlParts.push(`<table class="md-table">${thead}${tbody}</table>`);
      continue; // while 루프 계속 (i는 이미 진행됨)
    }

    // 테이블이 아니면 원래 라인 저장
    htmlParts.push(line);
    i += 1;
  }

  const preProcessed = htmlParts.join('\n');

  // 2) 인라인/블록 변환 (헤더, 리스트, strong/em 등)
  return preProcessed
    // 헤더 변환
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 굵게/이탤릭
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // 순서없는 리스트 아이템
    .replace(/^\s*\* (.*$)/gim, '<li>$1</li>')
    .replace(/^\s*- (.*$)/gim, '<li>$1</li>')
    // 줄바꿈을 <br>로
    .replace(/\n/g, '<br>')
    // 리스트 래핑 (연속 li를 하나의 ul로)
    .replace(/(?:<br>)*(<li>.*?<\/li>)(?:<br>)*/gims, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, ''); // 인접한 ul 병합
};

// 간단 HTML 이스케이프
const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// 값이 비어있는지 확인 (문자열의 공백, 빈 배열, null/undefined 모두 false 취급)
const isNonEmpty = (val: any): boolean => {
  if (val == null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0; // 객체면 키 존재 여부로 판단
  return true;
};

// 정규분포 PDF
const gaussianPdf = (x: number, mean: number, std: number): number => {
  if (std === 0) return x === mean ? 1 : 0;
  const variance = std * std;
  return (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-0.5 * ((x - mean) ** 2) / variance);
};

// 음성 점수 분포 차트 렌더링 (SVG)
const renderDistributionCharts = (analysisData: InterviewAnalysisData): string => {
  const keys: { key: string; label: string }[] = [
    { key: 'confidence_score', label: '자신감' },
    { key: 'fluency_score', label: '유창성' },
    { key: 'stability_score', label: '안정성' },
    { key: 'clarity_score', label: '명료성' },
    { key: 'overall_score', label: '전체' },
  ];

  const pa = analysisData.percentileAnalysis || {};
  const percentile = pa.percentiles || {};
  const dist = (pa as any).distribution || pa; // fallback: API가 바로 키별 {mean,std,...}를 줄 수도 있음

  const voice = analysisData.voiceScores || {};
  const readUserScore = (key: string): number => {
    const d = (dist as any)[key];
    const fromDist = d && typeof d.user_score !== 'undefined' ? Number(d.user_score) : NaN;
    const fromVoice = typeof (voice as any)[key] !== 'undefined' ? Number((voice as any)[key]) : NaN;
    const val = !Number.isNaN(fromDist) ? fromDist : (!Number.isNaN(fromVoice) ? fromVoice : NaN);
    return Number.isFinite(val) ? Math.max(0, Math.min(100, val)) : 0;
  };

  const readPercentile = (key: string, d: any): number | null => {
    const fromDist = d && typeof d.percentile === 'number' ? d.percentile : null;
    const fromTable = typeof percentile[key] === 'number' ? percentile[key] : null;
    return fromDist != null ? fromDist : fromTable;
  };

  const width = 480;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const drawableWidth = width - paddingLeft - paddingRight;

  const buildOne = (key: string, label: string) => {
    const d = (dist as any)[key] || null;
    if (!d || typeof d.mean !== 'number' || typeof d.std !== 'number') {
      return `
      <div class="dist-chart">
        <div class="dist-title">${label}</div>
        <div style="font-size:12px;color:#6b7280;">분포 데이터가 없습니다.</div>
      </div>`;
    }
    const points = Array.from({ length: 101 }, (_, i) => i);
    const curve = points.map(x => gaussianPdf(x, d.mean, d.std));
    const maxY = Math.max(...curve);
    const path = points.map((x, i) => {
      const px = paddingLeft + (x / 100) * drawableWidth;
      const py = height - 20 - (curve[i] / maxY) * (height - 40);
      return `${i === 0 ? 'M' : 'L'}${px},${py}`;
    }).join(' ');
    const userScore = readUserScore(key);
    const userX = paddingLeft + (userScore / 100) * drawableWidth;
    const pct = readPercentile(key, d);

    return `
      <div class="dist-chart">
        <div class="dist-title">${label} (${userScore.toFixed(1)}점)</div>
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <path d="${path}" fill="none" stroke="#2563eb" stroke-width="2" />
          <line x1="${userX}" y1="20" x2="${userX}" y2="${height - 20}" stroke="#ef4444" stroke-width="2" />
          ${pct != null ? `
            <text class="dist-percentile-label" x="${Math.min(width - 70, Math.max(10, userX + 6)) + 30}" y="20" text-anchor="middle">상위 ${pct}%</text>
          ` : ''}
          <!-- Axis labels -->
          <text class="dist-axis-label" x="${paddingLeft}" y="${height - 4}">0</text>
          <text class="dist-axis-label" x="${paddingLeft + drawableWidth/4}" y="${height - 4}">25</text>
          <text class="dist-axis-label" x="${paddingLeft + drawableWidth/2}" y="${height - 4}">50</text>
          <text class="dist-axis-label" x="${paddingLeft + 3*drawableWidth/4}" y="${height - 4}">75</text>
          <text class="dist-axis-label" x="${paddingLeft + drawableWidth}" y="${height - 4}">100</text>
        </svg>
      </div>`;
  };

  return keys.map(k => buildOne(k.key, k.label)).join('\n');
};

// HTML 템플릿 생성 함수
const generateHTMLTemplate = (analysisData: InterviewAnalysisData): string => {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 14px;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
          min-height: auto;
          height: auto;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
          border-left: 4px solid #2563eb;
          padding-left: 10px;
        }
        .score-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .score-label {
          font-weight: 500;
        }
        .score-value {
          font-weight: bold;
          color: #2563eb;
        }
        /* Simple horizontal bar chart for voice scores */
        .bar-chart {
          margin-top: 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0;
        }
        .bar-label {
          width: 90px;
          font-size: 14px;
          color: #374151;
        }
        .bar-track {
          flex: 1;
          height: 10px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #93c5fd, #2563eb);
        }
        .bar-value {
          width: 48px;
          text-align: right;
          font-size: 12px;
          color: #111827;
        }
        .text-content {
          display: flex;
          flex-direction: column;
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 10px 0;
          white-space: pre-wrap;
        }
        .advice-content {
          background-color: #e3f2fd;
          padding: 15px;
          border-radius: 5px;
          margin: 10px 0;
          line-height: 1.6;
        }
        
        .advice-content h1, .advice-content h2, .advice-content h3 {
          color: #1976d2;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        
        .advice-content h1:first-child, .advice-content h2:first-child, .advice-content h3:first-child {
          margin-top: 0;
        }
        
        .advice-content strong {
          color: #424242;
          font-weight: 600;
        }
        
        .advice-content em {
          color: #616161;
          font-style: italic;
        }
        
        .advice-content ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .advice-content li {
          margin-bottom: 5px;
        }
        
        .text-analysis-section {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          min-height: auto;
          height: auto;
        }
        
        .text-analysis-section h3 {
          color:rgb(0, 0, 0);
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 18px;
        }
        
        .text-analysis-section h4 {
          color: #495057;
          margin-top: 15px;
          margin-bottom: 8px;
          font-size: 16px;
        }
        
        .matrix-container {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        
        .matrix-item {
          display: flex;
          flex-direction: column;
          background-color: #fff;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          min-height: auto;
          height: auto;
        }
        
        .matrix-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .matrix-theme {
          font-weight: bold;
          color: #495057;
        }
        
        .matrix-evidence {
          color: #6c757d;
          font-size: 14px;
        }
        
        .severity-chip {
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .recommendation-chip {
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
          margin-top: 8px;
        }
        
        .opportunity-list, .followup-list, .action-list {
          display: flex;
          flex-direction: column;
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .opportunity-list li, .followup-list li, .action-list li {
          margin-bottom: 5px;
          color: #495057;
        }
        
        .score-aggregation {
          display: flex;
          flex-direction: column;
          background-color: #fff;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          min-height: auto;
          height: auto;
        }
        
        .resume-analysis {
          display: flex;
          flex-direction: column;
          background-color: #fff;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          min-height: auto;
          height: auto;
        }
        
        .markdown-content {
          background-color: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
          line-height: 1.6;
        }
        
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          color: #007bff;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        
        .markdown-content h1:first-child, .markdown-content h2:first-child, .markdown-content h3:first-child {
          margin-top: 0;
        }
        
        .markdown-content strong {
          color: #495057;
          font-weight: 600;
        }
        
        .markdown-content em {
          color: #6c757d;
          font-style: italic;
        }
        
        .markdown-content ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        .markdown-content li {
          margin-bottom: 4px;
        }
        
        .markdown-content p {
          margin-bottom: 8px;
        }
        /* Markdown table styles */
        .md-table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          background-color: #fff;
        }
        .md-table th, .md-table td {
          border: 1px solid #e2e8f0;
          padding: 8px 10px;
          text-align: left;
          vertical-align: top;
          font-size: 14px;
        }
        .md-table thead th {
          background-color: #f1f5f9;
          font-weight: 600;
          color: #334155;
        }
        .md-table tbody tr:nth-child(even) {
          background-color: #f8fafc;
        }
        /* Question-by-Question Feedback */
        .qbqf-section {
          display: flex;
          flex-direction: column;
          margin-top: 20px;
        }
        .qbqf-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 10px 0 12px;
          text-align: left;
        }
        .qbqf-item {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        .qbqf-item-header {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .qbqf-detail {
          display: flex;
          flex-direction: column;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 10px;
          margin: 8px 0;
        }
        .qbqf-row { margin: 6px 0; display: flex; }
        .qbqf-label { color: #374151; font-size: 12px; font-weight: 700; margin-right: 8px; min-width: 64px; }
        .qbqf-text { color: #111827; font-size: 14px; line-height: 1.5; }
        .qbqf-coaching {
          margin-top: 6px;
          padding-left: 10px;
          border-left: 3px solid #e5e7eb;
        }
        .qbqf-quote {
          background: #ffffff;
          border-left: 3px solid #60a5fa;
          padding: 8px 10px;
          border-radius: 6px;
          color: #111827;
        }
        .percentile-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">🎤 면접 분석 결과 리포트</div>
        <div class="subtitle">생성일: ${currentDate}${
    analysisData.sessionId ? ` | 세션 ID: ${analysisData.sessionId}` : ""
  }</div>
      </div>

      ${
        analysisData.textAnalysis
          ? `
        <div class="section">
          <div class="section-title">📝 텍스트 분석 결과</div>
          <div class="text-content">
            ${generateTextAnalysisHTML(analysisData.textAnalysis)}
          </div>
        </div>
      `
          : ""
      }

      ${
        analysisData.voiceScores
          ? `
        <div class="section">
          <div class="section-title">🎤 음성 분석 결과</div>
          <div class="score-item">
            <span class="score-label">자신감 점수</span>
            <span class="score-value">${
              analysisData.voiceScores.confidence_score || "N/A"
            }</span>
          </div>
          <div class="score-item">
            <span class="score-label">유창성 점수</span>
            <span class="score-value">${
              analysisData.voiceScores.fluency_score || "N/A"
            }</span>
          </div>
          <div class="score-item">
            <span class="score-label">안정성 점수</span>
            <span class="score-value">${
              analysisData.voiceScores.stability_score || "N/A"
            }</span>
          </div>
          <div class="score-item">
            <span class="score-label">명료성 점수</span>
            <span class="score-value">${
              analysisData.voiceScores.clarity_score || "N/A"
            }</span>
          </div>
          <div class="score-item">
            <span class="score-label">전체 점수</span>
            <span class="score-value">${
              analysisData.voiceScores.overall_score || "N/A"
            }</span>
          </div>
          ${renderDistributionCharts(analysisData)}
        </div>
      `
          : ""
      }

      ${
        analysisData.videoAnalysis
          ? `
        <div class="section">
          <div class="section-title">📹 비디오 분석 결과</div>
          <div class="score-item">
            <span class="score-label">자세 안정성</span>
            <span class="score-value">${(() => { const v = (analysisData.videoAnalysis as any)?.behavioral_metrics?.posture?.stability_score; return typeof v === 'number' ? v.toFixed(1) + ' 점' : 'N/A'; })()}</span>
          </div>
          <div class="score-item">
            <span class="score-label">머리 안정성</span>
            <span class="score-value">${(() => { const v = (analysisData.videoAnalysis as any)?.behavioral_metrics?.head_movements?.head_stability_score; return typeof v === 'number' ? v.toFixed(1) + ' 점' : 'N/A'; })()}</span>
          </div>
          <div class="score-item">
            <span class="score-label">미소 비율</span>
            <span class="score-value">${(() => { const v = (analysisData.videoAnalysis as any)?.behavioral_metrics?.facial_expressions?.smile_percentage; return typeof v === 'number' ? v.toFixed(1) + ' %' : 'N/A'; })()}</span>
          </div>
          <div class="score-item">
            <span class="score-label">분당 눈깜빡임</span>
            <span class="score-value">${(() => { const v = (analysisData.videoAnalysis as any)?.behavioral_metrics?.eye_contact?.blink_rate_per_minute; return typeof v === 'number' ? v.toFixed(1) + ' 회' : 'N/A'; })()}</span>
          </div>
          <div class="score-item">
            <span class="score-label">분당 손 제스쳐</span>
            <span class="score-value">${(() => { const v = (analysisData.videoAnalysis as any)?.behavioral_metrics?.hand_gestures?.gesture_frequency_per_minute; return typeof v === 'number' ? v.toFixed(1) + ' 회' : 'N/A'; })()}</span>
          </div>
        </div>
      `
          : ""
      }

      ${
        analysisData.aiAdvice
          ? `
        <div class="section">
          <div class="section-title">🤖 AI 개선 조언</div>
          <div class="advice-content">
            ${generateMarkdownHTML(analysisData.aiAdvice)}
          </div>
        </div>
      `
          : ""
      }

      ${
        analysisData.percentileAnalysis &&
        analysisData.percentileAnalysis.percentiles
          ? `
        <div class="section">
          <div class="section-title">📊 백분위 분석</div>
          ${Object.entries(analysisData.percentileAnalysis.percentiles)
            .map(
              ([key, value]) => `
            <div class="percentile-item">
              <span class="score-label">${key}</span>
              <span class="score-value">${value}%</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      <div class="footer">
        <p>이 리포트는 AI 면접 분석 시스템에 의해 자동 생성되었습니다.</p>
        <p>생성 시간: ${new Date().toLocaleString("ko-KR")}</p>
      </div>
    </body>
    </html>
  `;
};

export const generateInterviewPDF = async (
  analysisData: InterviewAnalysisData
): Promise<string> => {
  try {
    if (Platform.OS === 'web') {
      // 웹 환경에서는 HTML을 새 창에서 열어서 인쇄 가능하게 함
      const htmlContent = generateHTMLTemplate(analysisData);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.focus();
        
        // 인쇄 대화상자 열기
        setTimeout(() => {
          newWindow.print();
        }, 1000);
        
        return 'PDF 인쇄 창이 열렸습니다. 브라우저의 인쇄 기능을 사용하여 PDF로 저장하세요.';
      } else {
        throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.');
      }
    } else {
      // 모바일 환경에서는 텍스트 리포트를 표시
      const resultText = generateDetailedReport(analysisData);
      Alert.alert(
        '🎤 면접 분석 결과 리포트',
        resultText,
        [
          { text: '확인', style: 'default' }
        ],
        { cancelable: true }
      );
      return '분석 결과가 표시되었습니다.';
    }
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
};

// 상세한 리포트 생성 함수 (기존 분석 결과 화면과 유사한 형태)
const generateDetailedReport = (analysisData: InterviewAnalysisData): string => {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  let report = `📅 생성일: ${currentDate}\n`;
  
  if (analysisData.sessionId) {
    report += `🆔 세션 ID: ${analysisData.sessionId}\n`;
  }
  report += '\n' + '='.repeat(50) + '\n\n';
  
  // 텍스트 분석 결과
  if (analysisData.textAnalysis) {
    report += `📝 텍스트 분석 결과\n`;
    report += '-'.repeat(30) + '\n';
    report += generateTextAnalysisText(analysisData.textAnalysis);
    report += '\n\n';
  }
  
  // 비언어적 표현 분석 결과
  if (analysisData.voiceScores || analysisData.videoAnalysis) {
    report += `🎭 비언어적 표현 분석 결과\n`;
    report += '-'.repeat(30) + '\n';
    
    if (analysisData.voiceScores) {
      report += `🎤 음성 분석\n`;
      report += `  • 자신감 점수: ${analysisData.voiceScores.confidence_score || 'N/A'}\n`;
      report += `  • 유창성 점수: ${analysisData.voiceScores.fluency_score || 'N/A'}\n`;
      report += `  • 안정성 점수: ${analysisData.voiceScores.stability_score || 'N/A'}\n`;
      report += `  • 명료성 점수: ${analysisData.voiceScores.clarity_score || 'N/A'}\n`;
      report += `  • 전체 점수: ${analysisData.voiceScores.overall_score || 'N/A'}\n\n`;
    }
    
    if (analysisData.videoAnalysis) {
      report += `📹 비디오 분석\n`;
      report += `  • 시선 접촉: ${analysisData.videoAnalysis.eye_contact || 'N/A'}\n`;
      report += `  • 표정 변화: ${analysisData.videoAnalysis.facial_expression || 'N/A'}\n`;
      report += `  • 자세: ${analysisData.videoAnalysis.posture || 'N/A'}\n`;
      report += `  • 제스처: ${analysisData.videoAnalysis.gestures || 'N/A'}\n`;
      report += `  • 전체 점수: ${analysisData.videoAnalysis.overall_score || 'N/A'}\n\n`;
    }
    
    if (analysisData.percentileAnalysis && analysisData.percentileAnalysis.percentiles) {
      report += `📊 백분위 분석\n`;
      Object.entries(analysisData.percentileAnalysis.percentiles).forEach(([key, value]) => {
        report += `  • ${key}: ${value}%\n`;
      });
      report += '\n';
    }
  }
  
  // AI 조언
  if (analysisData.aiAdvice) {
    report += `🤖 AI 개선 조언\n`;
    report += '-'.repeat(30) + '\n';
    report += `${analysisData.aiAdvice}\n\n`;
  }
  
  report += '='.repeat(50) + '\n';
  report += `⏰ 생성 시간: ${new Date().toLocaleString('ko-KR')}\n`;
  report += '이 리포트는 AI 면접 분석 시스템에 의해 자동 생성되었습니다.';
  
  return report;
};

// 텍스트 분석 결과를 텍스트 형태로 변환하는 함수
const generateTextAnalysisText = (textAnalysis: any): string => {
  if (!textAnalysis) return '';
  
  let text = '';
  
  // 총평
  if (textAnalysis.overall_summary) {
    text += `  📋 총평: ${textAnalysis.overall_summary}\n`;
  }
  
  // 면접 진행 근거
  if (textAnalysis.interview_flow_rationale) {
    text += `  🎯 면접 진행 근거: ${textAnalysis.interview_flow_rationale}\n`;
  }
  
  // 강점 매트릭스
  if (textAnalysis.strengths_matrix && textAnalysis.strengths_matrix.length > 0) {
    text += `  💪 강점 매트릭스:\n`;
    textAnalysis.strengths_matrix.forEach((item: any) => {
      text += `    • ${item.theme}: ${item.evidence.join(', ')}\n`;
    });
  }
  
  // 약점 매트릭스
  if (textAnalysis.weaknesses_matrix && textAnalysis.weaknesses_matrix.length > 0) {
    text += `  ⚠️ 약점 매트릭스:\n`;
    textAnalysis.weaknesses_matrix.forEach((item: any) => {
      text += `    • ${item.theme} (심각도: ${item.severity}): ${item.evidence.join(', ')}\n`;
    });
  }
  
  // 점수 집계
  if (textAnalysis.score_aggregation) {
    text += `  📊 점수 집계:\n`;
    text += `    캘리브레이션: ${textAnalysis.score_aggregation.calibration}\n`;
  }
  
  // 놓친 기회
  if (textAnalysis.missed_opportunities && textAnalysis.missed_opportunities.length > 0) {
    text += `  🔍 놓친 기회:\n`;
    textAnalysis.missed_opportunities.forEach((op: string) => {
      text += `    • ${op}\n`;
    });
  }
  
  // 추가 팔로업 제안
  if (textAnalysis.potential_followups_global && textAnalysis.potential_followups_global.length > 0) {
    text += `  💡 추가 팔로업 제안:\n`;
    textAnalysis.potential_followups_global.forEach((f: string) => {
      text += `    • ${f}\n`;
    });
  }
  
  // 채용 추천
  if (textAnalysis.hiring_recommendation) {
    const recommendationText = textAnalysis.hiring_recommendation === 'hire' ? '채용 추천' : '채용 비추천';
    text += `  🎯 채용 추천: ${recommendationText}\n`;
  }
  
  // 다음 액션
  if (textAnalysis.next_actions && textAnalysis.next_actions.length > 0) {
    text += `  📋 다음 액션:\n`;
    textAnalysis.next_actions.forEach((action: string) => {
      text += `    • ${action}\n`;
    });
  }
  
  // 이력서 종합 분석
  if (textAnalysis.full_resume_analysis) {
    text += `  📄 이력서 종합 분석:\n`;
    text += `    심층 분석: ${textAnalysis.full_resume_analysis["심층분석"]}\n`;
    text += `    교차 분석: ${textAnalysis.full_resume_analysis["교차분석"]}\n`;
    text += `    정합성 점검: ${textAnalysis.full_resume_analysis["정합성점검"]}\n`;
    text += `    NCS 요약: ${textAnalysis.full_resume_analysis["NCS요약"]}\n`;
  }
  
  return text;
};

export const generatePDFFromElement = async (
  elementRef: React.RefObject<any>,
  _fileName?: string
): Promise<string> => {
  try {
    if (!elementRef.current) {
      throw new Error('PDF로 변환할 요소를 찾을 수 없습니다.');
    }

    // 기본 분석 데이터로 PDF 생성
    const analysisData: InterviewAnalysisData = {
      voiceScores: null,
      videoAnalysis: null,
      textAnalysis: null,
      aiAdvice: '요소 캡처 기능은 현재 지원되지 않습니다.',
      percentileAnalysis: null,
      sessionId: undefined,
      timestamp: new Date().toISOString()
    };

    return await generateInterviewPDF(analysisData);
  } catch (error) {
    console.error('요소에서 PDF 생성 중 오류 발생:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
};
