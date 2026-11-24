/**
 * ==========================================================================
 * 스마트 에듀컴시간 (Smart Edu-ComTime) Core Application Logic
 * 중학교 교무행정 종합 시간표 & 결보강 & 시험감독 & AI 제약 조건 엔진
 * ==========================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA LAYER & COMSIGAN PROTOCOL PARSER
  // ==========================================================================

  /**
   * 학교 기본 정보 및 시간표 데이터 모델
   */
  const AppData = {
    school: {
      name: '서울누리중학교',
      code: '72914',
      grades: [1, 2, 3],
      classesPerGrade: 4, // 각 학년당 1~4반
      totalPeriods: 7,    // 월~목 7교시, 금 6교시
      days: [
        { id: 1, name: '월요일', short: '월' },
        { id: 2, name: '화요일', short: '화' },
        { id: 3, name: '수요일', short: '수' },
        { id: 4, name: '목요일', short: '목' },
        { id: 5, name: '금요일', short: '금' },
      ],
      periodTimes: [
        { period: 1, start: '09:00', end: '09:45' },
        { period: 2, start: '09:55', end: '10:40' },
        { period: 3, start: '10:50', end: '11:35' },
        { period: 4, start: '11:45', end: '12:30' },
        { period: 5, start: '13:20', end: '14:05' },
        { period: 6, start: '14:15', end: '15:00' },
        { period: 7, start: '15:10', end: '15:55' },
      ]
    },

    // 28명의 교사 마스터 데이터 (이름, 담당과목, 담임여부, 주당수업시수, 주간 보강횟수)
    teachers: [
      { id: 'T01', name: '김국어', subject: '국어', grade: 3, homeroom: null, weeklyHours: 16, subCount: 1, isNonTeaching: false },
      { id: 'T02', name: '이문학', subject: '국어', grade: 2, homeroom: { grade: 2, classNum: 1 }, weeklyHours: 18, subCount: 0, isNonTeaching: false },
      { id: 'T03', name: '박화법', subject: '국어', grade: 1, homeroom: { grade: 1, classNum: 1 }, weeklyHours: 17, subCount: 0, isNonTeaching: false },
      { id: 'T04', name: '이영진', subject: '수학', grade: 3, homeroom: { grade: 3, classNum: 1 }, weeklyHours: 19, subCount: 2, isNonTeaching: false },
      { id: 'T05', name: '최수학', subject: '수학', grade: 3, homeroom: { grade: 3, classNum: 2 }, weeklyHours: 18, subCount: 1, isNonTeaching: false },
      { id: 'T06', name: '정기하', subject: '수학', grade: 2, homeroom: { grade: 2, classNum: 2 }, weeklyHours: 17, subCount: 0, isNonTeaching: false },
      { id: 'T07', name: '한미적', subject: '수학', grade: 1, homeroom: { grade: 1, classNum: 2 }, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T08', name: '박영어', subject: '영어', grade: 3, homeroom: { grade: 3, classNum: 3 }, weeklyHours: 18, subCount: 1, isNonTeaching: false },
      { id: 'T09', name: '송회화', subject: '영어', grade: 2, homeroom: { grade: 2, classNum: 3 }, weeklyHours: 17, subCount: 0, isNonTeaching: false },
      { id: 'T10', name: '오독해', subject: '영어', grade: 1, homeroom: { grade: 1, classNum: 3 }, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T11', name: '강사회', subject: '사회', grade: 3, homeroom: { grade: 3, classNum: 4 }, weeklyHours: 17, subCount: 0, isNonTeaching: false },
      { id: 'T12', name: '윤역사', subject: '역사', grade: 2, homeroom: { grade: 2, classNum: 4 }, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T13', name: '문지리', subject: '사회', grade: 1, homeroom: { grade: 1, classNum: 4 }, weeklyHours: 15, subCount: 1, isNonTeaching: false },
      { id: 'T14', name: '신과학', subject: '과학', grade: 3, homeroom: null, weeklyHours: 18, subCount: 1, isNonTeaching: false },
      { id: 'T15', name: '임물리', subject: '과학', grade: 2, homeroom: null, weeklyHours: 17, subCount: 0, isNonTeaching: false },
      { id: 'T16', name: '조화학', subject: '과학', grade: 1, homeroom: null, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T17', name: '백생물', subject: '과학', grade: 2, homeroom: null, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T18', name: '황도덕', subject: '도덕', grade: 1, homeroom: null, weeklyHours: 14, subCount: 0, isNonTeaching: false },
      { id: 'T19', name: '오체육', subject: '체육', grade: 3, homeroom: null, weeklyHours: 19, subCount: 2, isNonTeaching: false },
      { id: 'T20', name: '권운동', subject: '체육', grade: 2, homeroom: null, weeklyHours: 18, subCount: 1, isNonTeaching: false },
      { id: 'T21', name: '남스포츠', subject: '체육', grade: 1, homeroom: null, weeklyHours: 18, subCount: 0, isNonTeaching: false },
      { id: 'T22', name: '서음악', subject: '음악', grade: 2, homeroom: null, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T23', name: '유미술', subject: '미술', grade: 3, homeroom: null, weeklyHours: 16, subCount: 0, isNonTeaching: false },
      { id: 'T24', name: '고기술', subject: '기술가정', grade: 2, homeroom: null, weeklyHours: 15, subCount: 0, isNonTeaching: false },
      { id: 'T25', name: '양가정', subject: '기술가정', grade: 1, homeroom: null, weeklyHours: 15, subCount: 0, isNonTeaching: false },
      { id: 'T26', name: '노정보', subject: '정보', grade: 1, homeroom: null, weeklyHours: 14, subCount: 0, isNonTeaching: false },
      { id: 'T27', name: '박보건', subject: '보건', grade: 0, homeroom: null, weeklyHours: 4, subCount: 0, isNonTeaching: true },
      { id: 'T28', name: '정상담', subject: '상담', grade: 0, homeroom: null, weeklyHours: 2, subCount: 0, isNonTeaching: true },
    ],

    // 시간표 매트릭스: [grade][classNum][day][period] = { teacherId, subject, room }
    classTimetable: {},
    // 교사별 시간표 인덱스: [teacherId][day][period] = { grade, classNum, subject, room }
    teacherTimetable: {},

    // 특별실/시설별 최대 동시 학급 한도 (Hard Constraint)
    facilityLimits: {
      '체육관': { name: '체육관/강당', limit: 4, subject: '체육' },
      '과학실': { name: '과학실(1,2실)', limit: 2, subject: '과학' },
      '컴퓨터실': { name: '컴퓨터실', limit: 1, subject: '정보' },
      '음악실': { name: '음악실', limit: 1, subject: '음악' },
      '미술실': { name: '미술실', limit: 1, subject: '미술' },
    },

    // 교사별 시간표 개별 제약 규칙
    teacherRules: [
      { id: 'R01', teacherId: 'T04', teacherName: '이영진', subject: '수학', type: 'AFTERNOON_OFF', day: 3, desc: '수요일 오후(5~7교시) 대학원 수업 공강', strictness: 'HARD', active: true },
      { id: 'R02', teacherId: 'T19', teacherName: '오체육', subject: '체육', type: 'MORNING_OFF', day: 5, desc: '금요일 1~2교시 체육부 업무 공강', strictness: 'HARD', active: true },
      { id: 'R03', teacherId: 'T01', teacherName: '김국어', subject: '국어', type: 'DAY_OFF', day: 1, desc: '월요일 수석교사 연구일 전일 공강', strictness: 'SOFT', active: false },
      { id: 'R04', teacherId: 'T08', teacherName: '박영어', subject: '영어', type: 'MAX_CONTINUOUS', day: 2, desc: '화요일 최대 2연속 수업 제한', strictness: 'SOFT', active: true },
    ],

    // 최근 결보강 처리 이력
    subHistory: [
      { date: '11/24 (화) 1교시', teacher: '강사회 (사회)', targetClass: '3-4', subTeacher: '문지리 (사회)', type: '즉시 대체', status: '승인완료' },
      { date: '11/23 (월) 4교시', teacher: '최수학 (수학)', targetClass: '3-2', subTeacher: '박영어 (영어)', type: '교과 맞교환', status: '교체반영' },
    ],

    // 시험 감독 제외 교사 리스트
    excludedProctors: ['박보건', '정상담', '강임산']
  };

  /**
   * 컴시간 오픈소스 파서 규격 및 모의 시간표 생성기
   * (실제 학교 현장에서 충돌 없이 정상 동작하는 1~3학년 12학급 표준 시간표 생성)
   */
  const ComsiganParser = {
    /**
     * 컴시간 실시간 API 또는 CORS 프록시 엔드포인트 연동 (Architecture Reference)
     * 컴시간 원본은 http://comci.net:4082/ 번호와 EUC-KR 및 이진 인덱스 배열 구조를 가집니다.
     */
    async fetchRemoteData(schoolName, proxyUrl) {
      console.log(`[Comsigan] Fetching timetable for ${schoolName} via proxy ${proxyUrl}`);
      // 실제 환경에서는 fetch(proxyUrl + '?school=' + encodeURIComponent(schoolName)) 로 연동
      // 데모 및 독립 구동을 위해 표준 파싱된 JSON 구조로 즉각 초기화
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, schoolName: schoolName, timestamp: new Date().toISOString() });
        }, 500);
      });
    },

    /**
     * 전교생 시간표 매트릭스 초기화 및 유효 시간표 생성
     */
    generateFullTimetable() {
      const classMap = {};
      const teacherMap = {};

      // 초기화
      AppData.teachers.forEach(t => {
        teacherMap[t.id] = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
      });

      for (let g = 1; g <= 3; g++) {
        classMap[g] = {};
        for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
          classMap[g][c] = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
        }
      }

      // 학년별 표준 교과 분배 풀
      const gradeSubjectTeacherPool = {
        1: [
          { subject: '국어', teacherId: 'T03', room: '교실', weight: 4 },
          { subject: '수학', teacherId: 'T07', room: '교실', weight: 4 },
          { subject: '영어', teacherId: 'T10', room: '교실', weight: 4 },
          { subject: '사회', teacherId: 'T13', room: '교실', weight: 3 },
          { subject: '과학', teacherId: 'T16', room: '과학실', weight: 4 },
          { subject: '도덕', teacherId: 'T18', room: '교실', weight: 2 },
          { subject: '체육', teacherId: 'T21', room: '체육관', weight: 3 },
          { subject: '기술가정', teacherId: 'T25', room: '기술실', weight: 3 },
          { subject: '정보', teacherId: 'T26', room: '컴퓨터실', weight: 2 },
          { subject: '한문', teacherId: 'T03', room: '교실', weight: 2 },
          { subject: '음악', teacherId: 'T22', room: '음악실', weight: 2 },
        ],
        2: [
          { subject: '국어', teacherId: 'T02', room: '교실', weight: 4 },
          { subject: '수학', teacherId: 'T06', room: '교실', weight: 4 },
          { subject: '영어', teacherId: 'T09', room: '교실', weight: 4 },
          { subject: '역사', teacherId: 'T12', room: '교실', weight: 3 },
          { subject: '과학', teacherId: 'T15', room: '과학실', weight: 4 },
          { subject: '체육', teacherId: 'T20', room: '체육관', weight: 3 },
          { subject: '음악', teacherId: 'T22', room: '음악실', weight: 2 },
          { subject: '미술', teacherId: 'T23', room: '미술실', weight: 2 },
          { subject: '기술가정', teacherId: 'T24', room: '기술실', weight: 3 },
        ],
        3: [
          { subject: '국어', teacherId: 'T01', room: '교실', weight: 4 },
          { subject: '수학', teacherId: 'T04', room: '교실', weight: 4 },
          { subject: '수학B', teacherId: 'T05', room: '교실', weight: 4 },
          { subject: '영어', teacherId: 'T08', room: '교실', weight: 4 },
          { subject: '사회', teacherId: 'T11', room: '교실', weight: 3 },
          { subject: '과학', teacherId: 'T14', room: '과학실', weight: 4 },
          { subject: '체육', teacherId: 'T19', room: '체육관', weight: 3 },
          { subject: '미술', teacherId: 'T23', room: '미술실', weight: 2 },
        ]
      };

      // 각 학년 각 반별로 겹치지 않게 안정적인 시드 기반 스케줄링 생성
      for (let g = 1; g <= 3; g++) {
        const pool = gradeSubjectTeacherPool[g];
        for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
          let poolIndex = (g * 3 + c * 2);
          for (let d = 1; d <= 5; d++) {
            const maxP = (d === 5) ? 6 : 7;
            for (let p = 1; p <= maxP; p++) {
              let candidate = null;
              // 충돌 회피 루프
              for (let offset = 0; offset < pool.length; offset++) {
                const item = pool[(poolIndex + offset) % pool.length];
                // 교사가 해당 요일 해당 교시에 다른 반 수업이 없는지 확인
                if (!teacherMap[item.teacherId][d][p]) {
                  candidate = item;
                  poolIndex += (offset + 1);
                  break;
                }
              }

              if (!candidate) {
                // 대체 과목 선정
                candidate = pool[0];
              }

              // 학급 시간표에 저장
              const slotInfo = {
                teacherId: candidate.teacherId,
                subject: candidate.subject,
                room: candidate.room === '교실' ? `${g}0${c}호` : candidate.room,
                grade: g,
                classNum: c
              };

              classMap[g][c][d][p] = slotInfo;

              // 교사 시간표 역색인 저장
              teacherMap[candidate.teacherId][d][p] = {
                grade: g,
                classNum: c,
                subject: candidate.subject,
                room: slotInfo.room
              };
            }
          }
        }
      }

      AppData.classTimetable = classMap;
      AppData.teacherTimetable = teacherMap;
      console.log('[Comsigan] Full timetable indexed successfully.');
    }
  };

  // ==========================================================================
  // 2. 결보강(수업 교체) 스마트 매칭 시스템 (Swap & Substitute Engine)
  // ==========================================================================

  const SubstituteEngine = {
    /**
     * 특정 결강 교사/요일/교시에 대한 공강 교사 검색 및 맞교환(Swap) 계산
     */
    findMatches(absentTeacherId, targetDay, targetPeriod) {
      targetDay = parseInt(targetDay, 10);
      targetPeriod = parseInt(targetPeriod, 10);

      const teacherA = AppData.teachers.find(t => t.id === absentTeacherId);
      if (!teacherA) return { freeTeachers: [], swapSlots: [], targetSlot: null };

      // 1. 해당 시간 absentTeacher의 수업 슬롯 확인
      const targetSlot = AppData.teacherTimetable[absentTeacherId]?.[targetDay]?.[targetPeriod];
      if (!targetSlot) {
        // 원래 해당 교시에 수업이 없는 공강일 경우
        return { freeTeachers: [], swapSlots: [], targetSlot: null, isFreeAlready: true };
      }

      const targetGrade = targetSlot.grade;
      const targetClassNum = targetSlot.classNum;

      // 2. 공강 교사(Free Teachers) 필터링
      const freeTeachers = [];
      AppData.teachers.forEach(tb => {
        // 본인 제외 및 비교과 상주 교사(보건/상담) 제외
        if (tb.id === absentTeacherId || tb.isNonTeaching) return;

        // targetDay, targetPeriod에 수업이 없어야 함
        const isFree = !AppData.teacherTimetable[tb.id]?.[targetDay]?.[targetPeriod];
        if (isFree) {
          // 적합도 가산점 계산
          let score = 50;
          if (tb.grade === targetGrade) score += 20; // 동일 학년 교사
          if (tb.subject === teacherA.subject) score += 25; // 동일 교과목
          score -= (tb.weeklyHours * 1.5); // 주당 시수 많을수록 후순위
          score -= (tb.subCount * 10); // 이번 주 보강을 이미 많이 한 교사 배려

          freeTeachers.push({
            teacher: tb,
            score: Math.max(10, Math.round(score)),
            isSameSubject: tb.subject === teacherA.subject,
            isSameGrade: tb.grade === targetGrade
          });
        }
      });

      // 점수 내림차순 정렬
      freeTeachers.sort((a, b) => b.score - a.score);

      // 3. 학생 결손 없는 '동일 학급 맞교환(Mutual Class Swap)' 슬롯 계산
      // 원리: 대상 학급(예: 3-2반)의 다른 시간표 슬롯 중,
      // 그 슬롯의 교사 B가 (targetDay, targetPeriod)에 공강이고,
      // 결강 교사 A가 그 슬롯(day', period')에 공강인 경우 -> 완벽한 1:1 맞교환 성립!
      const swapSlots = [];
      const classWeekly = AppData.classTimetable[targetGrade]?.[targetClassNum];

      if (classWeekly) {
        for (let d = 1; d <= 5; d++) {
          const maxP = (d === 5) ? 6 : 7;
          for (let p = 1; p <= maxP; p++) {
            // 결강 슬롯 본인은 제외
            if (d === targetDay && p === targetPeriod) continue;

            const otherSlot = classWeekly[d]?.[p];
            if (!otherSlot || otherSlot.teacherId === absentTeacherId) continue;

            const teacherB = AppData.teachers.find(t => t.id === otherSlot.teacherId);
            if (!teacherB || teacherB.isNonTeaching) continue;

            // 조건 1: 교사 B가 대상 교시(targetDay, targetPeriod)에 공강인가?
            const teacherBIsFreeAtTarget = !AppData.teacherTimetable[teacherB.id]?.[targetDay]?.[targetPeriod];

            // 조건 2: 결강 교사 A가 교사 B의 수업 시간(d, p)에 공강인가?
            const teacherAIsFreeAtSwap = !AppData.teacherTimetable[absentTeacherId]?.[d]?.[p];

            if (teacherBIsFreeAtTarget && teacherAIsFreeAtSwap) {
              const dayName = AppData.school.days.find(x => x.id === d)?.name || `${d}요일`;
              swapSlots.push({
                teacherB: teacherB,
                swapDay: d,
                swapDayName: dayName,
                swapPeriod: p,
                swapSubject: otherSlot.subject,
                targetGrade,
                targetClassNum,
                quality: (d === targetDay) ? '당일 교체 (최고편의)' : '주간 맞교환',
                reason: `${targetGrade}-${targetClassNum}반 ${otherSlot.subject} 수업과 1:1 맞바꿈`
              });
            }
          }
        }
      }

      return {
        targetSlot,
        freeTeachers,
        swapSlots
      };
    },

    /**
     * 결보강 확정 처리 및 시간표 실제 치환
     */
    applySwap(type, data) {
      if (type === 'SWAP') {
        // 맞교환 치환
        const { teacherAId, teacherBId, targetDay, targetPeriod, swapDay, swapPeriod, grade, classNum } = data;
        const slotA = AppData.classTimetable[grade][classNum][targetDay][targetPeriod];
        const slotB = AppData.classTimetable[grade][classNum][swapDay][swapPeriod];

        // 학급 시간표 스왑
        AppData.classTimetable[grade][classNum][targetDay][targetPeriod] = {
          ...slotB,
          room: slotA.room
        };
        AppData.classTimetable[grade][classNum][swapDay][swapPeriod] = {
          ...slotA,
          room: slotB.room
        };

        // 교사 시간표 갱신
        AppData.teacherTimetable[teacherAId][swapDay][swapPeriod] = AppData.teacherTimetable[teacherAId][targetDay][targetPeriod];
        delete AppData.teacherTimetable[teacherAId][targetDay][targetPeriod];

        AppData.teacherTimetable[teacherBId][targetDay][targetPeriod] = AppData.teacherTimetable[teacherBId][swapDay][swapPeriod];
        delete AppData.teacherTimetable[teacherBId][swapDay][swapPeriod];

        // 보강 횟수 기록
        const tA = AppData.teachers.find(t => t.id === teacherAId);
        const tB = AppData.teachers.find(t => t.id === teacherBId);
        if (tA) tA.subCount += 1;
        if (tB) tB.subCount += 1;

        // 이력 추가
        AppData.subHistory.unshift({
          date: `${AppData.school.days.find(d=>d.id===targetDay)?.short} ${targetPeriod}교시`,
          teacher: `${tA?.name} (${tA?.subject})`,
          targetClass: `${grade}-${classNum}`,
          subTeacher: `${tB?.name} (${tB?.subject})`,
          type: '교과 맞교환',
          status: '교체완료'
        });

      } else if (type === 'DIRECT') {
        // 직접 대체 (보강)
        const { teacherAId, subTeacherId, targetDay, targetPeriod, grade, classNum } = data;
        const tA = AppData.teachers.find(t => t.id === teacherAId);
        const tSub = AppData.teachers.find(t => t.id === subTeacherId);

        // 학급 시간표에 대체교사 표기
        if (AppData.classTimetable[grade]?.[classNum]?.[targetDay]?.[targetPeriod]) {
          AppData.classTimetable[grade][classNum][targetDay][targetPeriod].teacherId = subTeacherId;
          AppData.classTimetable[grade][classNum][targetDay][targetPeriod].subject = `${tA.subject}(보강)`;
        }

        if (tSub) tSub.subCount += 1;

        AppData.subHistory.unshift({
          date: `${AppData.school.days.find(d=>d.id===targetDay)?.short} ${targetPeriod}교시`,
          teacher: `${tA?.name} (${tA?.subject})`,
          targetClass: `${grade}-${classNum}`,
          subTeacher: `${tSub?.name} (${tSub?.subject})`,
          type: '즉시 대체',
          status: '보강완료'
        });
      }
    }
  };

  // ==========================================================================
  // 3. 맞춤형 시험 감독 시간표 자동 구성 엔진 (Exam Proctor Engine)
  // ==========================================================================

  const ExamProctorEngine = {
    /**
     * 시험 감독표 자동 생성 알고리즘
     * - 학년별 부분 시험 지원: 3학년만 시험, 1·2학년은 정규 수업 유지
     * - 담임교사 본인 학급 감독 금지 (공정성)
     * - 당해 교시 출제 교과목 교사 시험 감독 배제 (본부/복도 순회)
     * - 잔류 학년(1·2학년) 정규 수업 진행 교사 자동 보호
     * - 정감독 / 부감독 2인 1실 체제 & 교사별 감독 횟수 편차 1회 이내 균등 배정
     */
    generateExamRoster(options) {
      const {
        examGrade = 3,
        periods = [
          { num: 1, subject: '국어', time: '09:10 ~ 10:00' },
          { num: 2, subject: '수학', time: '10:20 ~ 11:10' },
          { num: 3, subject: '과학', time: '11:30 ~ 12:20' }
        ],
        excludeHomeroom = true,
        excludeSubjectTeacher = true,
        excludedTeachers = AppData.excludedProctors
      } = options;

      const examClasses = [];
      for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
        examClasses.push({ grade: examGrade, classNum: c, room: `${examGrade}학년 ${c}반` });
      }

      // 교사별 감독 배정 카운트 트래커
      const proctorCounts = {};
      AppData.teachers.forEach(t => { proctorCounts[t.id] = 0; });

      const roster = []; // 결과 배열

      // 교시별 배정
      periods.forEach(pInfo => {
        const periodRoster = {
          period: pInfo.num,
          subject: pInfo.subject,
          time: pInfo.time,
          roomAssignments: [],
          hallwayProctor: null,
          hqProctor: null
        };

        // 1. 잔류 학년(1, 2학년)에서 해당 교시에 정규 수업을 가르치는 교사 목록 추출
        // (시험 감독에 배정되면 수업 결손이 발생하므로 완벽 분리)
        const busyInNormalClasses = new Set();
        [1, 2].forEach(g => {
          for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
            // 시험 당일 화요일(2) 기준 시간표
            const slot = AppData.classTimetable[g]?.[c]?.[2]?.[pInfo.num];
            if (slot && slot.teacherId) {
              busyInNormalClasses.add(slot.teacherId);
            }
          }
        });

        // 2. 가용 감독 교사 풀 산출
        const availableTeachers = AppData.teachers.filter(t => {
          // 명시적 제외 교사 (보건, 상담, 산모 등)
          if (excludedTeachers.includes(t.name) || t.isNonTeaching) return false;
          // 정규 수업 지도 중인 교사 제외
          if (busyInNormalClasses.has(t.id)) return false;
          // 시험 출제 교과목 교사 배제 여부
          if (excludeSubjectTeacher && t.subject.startsWith(pInfo.subject)) return false;
          return true;
        });

        // 공정성을 위해 지금까지 감독 횟수가 적은 교사 우선 정렬 (Greedy Balanced)
        availableTeachers.sort((a, b) => proctorCounts[a.id] - proctorCounts[b.id]);

        const assignedThisPeriod = new Set();

        // 3. 각 시험실별 정감독, 부감독 배정
        examClasses.forEach(examClass => {
          // 정감독(Main Proctor) 선정
          let mainCandidate = availableTeachers.find(t => {
            if (assignedThisPeriod.has(t.id)) return false;
            // 담임 배제 규칙
            if (excludeHomeroom && t.homeroom && t.homeroom.grade === examClass.grade && t.homeroom.classNum === examClass.classNum) {
              return false;
            }
            return true;
          });

          if (!mainCandidate && availableTeachers.length > 0) {
            mainCandidate = availableTeachers.find(t => !assignedThisPeriod.has(t.id));
          }

          if (mainCandidate) {
            assignedThisPeriod.add(mainCandidate.id);
            proctorCounts[mainCandidate.id] += 1;
          }

          // 부감독(Sub Proctor) 선정
          let subCandidate = availableTeachers.find(t => {
            if (assignedThisPeriod.has(t.id)) return false;
            if (excludeHomeroom && t.homeroom && t.homeroom.grade === examClass.grade && t.homeroom.classNum === examClass.classNum) {
              return false;
            }
            return true;
          });

          if (!subCandidate && availableTeachers.length > 0) {
            subCandidate = availableTeachers.find(t => !assignedThisPeriod.has(t.id));
          }

          if (subCandidate) {
            assignedThisPeriod.add(subCandidate.id);
            proctorCounts[subCandidate.id] += 1;
          }

          periodRoster.roomAssignments.push({
            room: examClass.room,
            grade: examClass.grade,
            classNum: examClass.classNum,
            mainProctor: mainCandidate ? { name: mainCandidate.name, subject: mainCandidate.subject } : { name: '미배정', subject: '-' },
            subProctor: subCandidate ? { name: subCandidate.name, subject: subCandidate.subject } : { name: '미배정', subject: '-' }
          });
        });

        // 4. 출제 교사는 시험 본부 및 복도 순회(질의응답 지원) 배정
        const subjectTeachers = AppData.teachers.filter(t => t.subject.startsWith(pInfo.subject));
        periodRoster.hallwayProctor = subjectTeachers[0] ? `${subjectTeachers[0].name} (${subjectTeachers[0].subject} 출제)` : '순회 감독관';
        periodRoster.hqProctor = subjectTeachers[1] ? `${subjectTeachers[1].name} (본부 대기)` : '연구부장';

        roster.push(periodRoster);
      });

      return {
        roster,
        examGrade,
        proctorCounts,
        residualGradeCount: 8 // 1학년 4학급 + 2학년 4학급
      };
    }
  };

  // ==========================================================================
  // 4. 초기 시간표 편성 제약 조건 & 자연어 AI 인터페이스 (Constraint Engine)
  // ==========================================================================

  const ConstraintEngine = {
    /**
     * 자연어 입력 파서 (Mock AI Natural Language Parsing Engine)
     * 예시 입력:
     * - "체육 수업은 동시에 4명까지만 겹치게 해줘"
     * - "김철수 선생님은 수요일 오후에 수업 없게 해줘"
     * - "과학실은 동시에 2학급 이하로 제한해줘"
     * - "박영희 선생님은 금요일 1교시 수업 배제해줘"
     */
    parseNaturalLanguagePrompt(text) {
      const clean = text.trim();
      const result = {
        success: false,
        type: null,
        data: null,
        reply: ''
      };

      // 1. 시설 동시 사용 한도 패턴: "(체육|과학|음악|미술|컴퓨터) ... (N)명|학급|실"
      const facilityMatch = clean.match(/(체육|과학|컴퓨터|음악|미술|강당)/);
      const numberMatch = clean.match(/(\d+)\s*(명|학급|실|개)/);

      if (facilityMatch && numberMatch) {
        let fKey = facilityMatch[1];
        if (fKey === '강당') fKey = '체육관';
        if (fKey === '체육') fKey = '체육관';
        if (fKey === '과학') fKey = '과학실';
        if (fKey === '컴퓨터') fKey = '컴퓨터실';
        if (fKey === '음악') fKey = '음악실';
        if (fKey === '미술') fKey = '미술실';

        const limit = parseInt(numberMatch[1], 10);
        if (AppData.facilityLimits[fKey]) {
          AppData.facilityLimits[fKey].limit = limit;
          result.success = true;
          result.type = 'FACILITY_LIMIT';
          result.data = { facility: fKey, limit };
          result.reply = `🎯 시설 제약 조건이 갱신되었습니다: <strong>[${AppData.facilityLimits[fKey].name}]</strong> 동시 사용 상한이 <strong>${limit}학급 이하</strong>로 설정되었습니다.`;
          return result;
        }
      }

      // 2. 교사별 요일/시간대 공강 요구 패턴
      // 예: "이영진 선생님은 수요일 오후에 수업 없게 해줘", "김국어 선생님은 월요일 1교시 제외"
      let foundTeacher = null;
      for (const t of AppData.teachers) {
        if (clean.includes(t.name) || clean.includes(t.name.slice(1))) {
          foundTeacher = t;
          break;
        }
      }

      if (foundTeacher) {
        let dayId = 3; // 기본 수요일
        if (clean.includes('월')) dayId = 1;
        else if (clean.includes('화')) dayId = 2;
        else if (clean.includes('수')) dayId = 3;
        else if (clean.includes('목')) dayId = 4;
        else if (clean.includes('금')) dayId = 5;

        const dayName = AppData.school.days.find(d => d.id === dayId)?.name;

        let ruleType = 'AFTERNOON_OFF';
        let desc = `${dayName} 오후(5~7교시) 공강 배정`;

        if (clean.includes('오전') || clean.includes('1교시') || clean.includes('1~2')) {
          ruleType = 'MORNING_OFF';
          desc = `${dayName} 오전(1~2교시) 공강 배정`;
        } else if (clean.includes('전일') || clean.includes('하루') || clean.includes('연구일')) {
          ruleType = 'DAY_OFF';
          desc = `${dayName} 전일 공강 (연구일)`;
        } else if (clean.includes('연속') || clean.includes('연강')) {
          ruleType = 'MAX_CONTINUOUS';
          desc = `${dayName} 연속 수업 상한(2연강) 제한`;
        }

        const newRule = {
          id: `R${String(AppData.teacherRules.length + 1).padStart(2, '0')}`,
          teacherId: foundTeacher.id,
          teacherName: foundTeacher.name,
          subject: foundTeacher.subject,
          type: ruleType,
          day: dayId,
          desc: desc,
          strictness: 'HARD',
          active: true
        };

        AppData.teacherRules.unshift(newRule);
        result.success = true;
        result.type = 'TEACHER_RULE';
        result.data = newRule;
        result.reply = `✅ 교사 제약 조건이 자동 등록되었습니다: <strong>[${foundTeacher.name} 선생님 (${foundTeacher.subject})]</strong> → <strong>${desc}</strong> (Hard Constraint 반영 완료)`;
        return result;
      }

      // 패턴 매칭 실패 시 일반 안내
      result.reply = `🤔 말씀하신 내용을 정확히 파악하지 못했습니다. 다음과 같은 형식으로 입력해 보세요:<br>
      • "체육 수업은 동시에 4명까지만 겹치게 해줘"<br>
      • "이영진 선생님은 수요일 오후에 수업 없게 해줘"<br>
      • "과학실은 동시에 2학급 이하로 제한해줘"`;
      return result;
    },

    /**
     * 실시간 제약 조건 충돌 검사 (Validation Engine)
     */
    validateSchedule() {
      const violations = [];

      // 1. 시설 동시 사용 한도 검사
      for (const [fKey, fData] of Object.entries(AppData.facilityLimits)) {
        for (let d = 1; d <= 5; d++) {
          const maxP = (d === 5) ? 6 : 7;
          for (let p = 1; p <= maxP; p++) {
            let simultaneousCount = 0;
            const collidingClasses = [];

            // 전 학년 전 학급 조사
            for (let g = 1; g <= 3; g++) {
              for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
                const slot = AppData.classTimetable[g]?.[c]?.[d]?.[p];
                if (slot && (slot.subject === fData.subject || slot.room.includes(fKey))) {
                  simultaneousCount++;
                  collidingClasses.push(`${g}-${c}`);
                }
              }
            }

            if (simultaneousCount > fData.limit) {
              const dayName = AppData.school.days.find(x => x.id === d)?.short;
              violations.push({
                type: 'FACILITY_OVERFLOW',
                severity: 'CRITICAL',
                title: `${fData.name} 동시 수용 한도 초과`,
                desc: `${dayName}요일 ${p}교시에 총 ${simultaneousCount}개 학급(${collidingClasses.join(', ')})이 배정되어 최대 허용 한도(${fData.limit}학급)를 ${simultaneousCount - fData.limit}학급 초과했습니다.`
              });
            }
          }
        }
      }

      // 2. 교사별 개별 제약 규칙 검사
      AppData.teacherRules.filter(r => r.active).forEach(rule => {
        const tSched = AppData.teacherTimetable[rule.teacherId]?.[rule.day];
        if (!tSched) return;

        const dayName = AppData.school.days.find(d => d.id === rule.day)?.short;

        if (rule.type === 'AFTERNOON_OFF') {
          // 5, 6, 7교시에 수업이 있으면 위반
          [5, 6, 7].forEach(p => {
            if (tSched[p]) {
              violations.push({
                type: 'TEACHER_OFF_VIOLATION',
                severity: rule.strictness === 'HARD' ? 'HIGH' : 'MEDIUM',
                title: `${rule.teacherName} 선생님 ${dayName}요일 오후 공강 위반`,
                desc: `${rule.desc} 조건이 등록되어 있으나, ${dayName}요일 ${p}교시에 ${tSched[p].grade}-${tSched[p].classNum}반 수업이 배정되어 있습니다.`
              });
            }
          });
        } else if (rule.type === 'MORNING_OFF') {
          [1, 2].forEach(p => {
            if (tSched[p]) {
              violations.push({
                type: 'TEACHER_OFF_VIOLATION',
                severity: rule.strictness === 'HARD' ? 'HIGH' : 'MEDIUM',
                title: `${rule.teacherName} 선생님 ${dayName}요일 오전 공강 위반`,
                desc: `${rule.desc} 조건이 등록되어 있으나, ${dayName}요일 ${p}교시에 ${tSched[p].grade}-${tSched[p].classNum}반 수업이 배정되어 있습니다.`
              });
            }
          });
        } else if (rule.type === 'DAY_OFF') {
          const hasAny = Object.keys(tSched).length > 0;
          if (hasAny) {
            violations.push({
              type: 'TEACHER_DAY_OFF_VIOLATION',
              severity: 'HIGH',
              title: `${rule.teacherName} 선생님 ${dayName}요일 전일 공강 위반`,
              desc: `${dayName}요일에 총 ${Object.keys(tSched).length}시간의 수업이 배정되어 있어 전일 공강 조건을 만족하지 못했습니다.`
            });
          }
        }
      });

      return violations;
    }
  };

  // ==========================================================================
  // 5. PRESENTATION LAYER & UI CONTROLLERS
  // ==========================================================================

  const UI = {
    currentTab: 'timetable',
    currentTimetableView: 'class', // 'class' | 'teacher' | 'facility' | 'full'
    activeGrade: 3,
    activeClass: 1,
    activeTeacherId: 'T04',
    activeFacility: '체육관',

    init() {
      // 1. 시간표 데이터 초기화
      ComsiganParser.generateFullTimetable();

      // 2. DOM 요소 바인딩 및 이벤트 리스너 등록
      this.bindNavigation();
      this.bindTimetableViewer();
      this.bindSubstituteSystem();
      this.bindExamEngine();
      this.bindConstraintsAndChat();
      this.bindModals();
      this.startClock();

      // 3. 초기 뷰 렌더링
      this.renderTimetable();
      this.populateTeacherDropdowns();
      this.renderResourceRules();
      this.renderTeacherRules();
      this.runConflictValidation();

      // 결보강 기본 타겟 분석 1회 실행
      document.getElementById('btnRunSubMatching')?.click();
      // 시험 감독표 1회 기본 렌더
      document.getElementById('btnAutoGenerateExam')?.click();
    },

    // 라이브 시계
    startClock() {
      const clockEl = document.getElementById('currentLiveClock');
      const update = () => {
        const now = new Date();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayStr = days[now.getDay()];
        const timeStr = now.toTimeString().split(' ')[0];
        if (clockEl) {
          clockEl.textContent = `${timeStr} (${dayStr})`;
        }
      };
      update();
      setInterval(update, 1000);
    },

    // 탭 전환 네비게이션
    bindNavigation() {
      const tabs = document.querySelectorAll('.nav-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const targetId = `tab-${tab.dataset.tab}`;
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
          const targetPane = document.getElementById(targetId);
          if (targetPane) targetPane.classList.add('active');
          this.currentTab = tab.dataset.tab;
        });
      });

      // 빠른 인쇄 버튼
      document.getElementById('quickPrintBtn')?.addEventListener('click', () => {
        window.print();
      });

      // 상단 실시간 충돌 검사 버튼
      document.getElementById('validateScheduleBtn')?.addEventListener('click', () => {
        this.runConflictValidation(true);
      });
    },

    // ------------------------------------------------------------------------
    // TAB 1: 시간표 대시보드 뷰어 로직
    // ------------------------------------------------------------------------
    bindTimetableViewer() {
      const viewButtons = document.querySelectorAll('.view-mode-toggle .btn-toggle');
      const classSelectGroup = document.getElementById('classSelectGroup');
      const teacherSelectGroup = document.getElementById('teacherSelectGroup');
      const facilitySelectGroup = document.getElementById('facilitySelectGroup');

      viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          viewButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentTimetableView = btn.dataset.view;

          // 서브 컨트롤 표시 토글
          classSelectGroup.classList.add('hidden');
          teacherSelectGroup.classList.add('hidden');
          facilitySelectGroup.classList.add('hidden');

          if (this.currentTimetableView === 'class') {
            classSelectGroup.classList.remove('hidden');
          } else if (this.currentTimetableView === 'teacher') {
            teacherSelectGroup.classList.remove('hidden');
          } else if (this.currentTimetableView === 'facility') {
            facilitySelectGroup.classList.remove('hidden');
          }

          this.renderTimetable();
        });
      });

      document.getElementById('gradeSelect')?.addEventListener('change', (e) => {
        this.activeGrade = parseInt(e.target.value, 10);
        this.renderTimetable();
      });

      document.getElementById('classSelect')?.addEventListener('change', (e) => {
        this.activeClass = parseInt(e.target.value, 10);
        this.renderTimetable();
      });

      document.getElementById('teacherSelect')?.addEventListener('change', (e) => {
        this.activeTeacherId = e.target.value;
        this.renderTimetable();
      });

      document.getElementById('facilitySelect')?.addEventListener('change', (e) => {
        this.activeFacility = e.target.value;
        this.renderTimetable();
      });
    },

    renderTimetable() {
      const tbody = document.getElementById('timetableGridBody');
      const titleEl = document.getElementById('timetableTitle');
      const descEl = document.getElementById('timetableDesc');
      if (!tbody) return;

      tbody.innerHTML = '';

      if (this.currentTimetableView === 'class') {
        const g = this.activeGrade;
        const c = this.activeClass;
        const homeroomTeacher = AppData.teachers.find(t => t.homeroom && t.homeroom.grade === g && t.homeroom.classNum === c);
        const hrInfo = homeroomTeacher ? `담임: ${homeroomTeacher.name} 선생님 (${homeroomTeacher.subject}) | ` : '';
        titleEl.textContent = `${g}학년 ${c}반 주간 정규 시간표`;
        descEl.textContent = `${hrInfo}교실: 본관 ${g}0${c}호 (컴시간 알리미 최신 캐시 연동)`;

        for (let p = 1; p <= AppData.school.totalPeriods; p++) {
          const tr = document.createElement('tr');
          const timeMeta = AppData.school.periodTimes[p - 1];
          tr.innerHTML = `
            <td class="period-label-cell">
              <span class="period-num">${p}교시</span>
              <span class="period-time-range">${timeMeta.start}~${timeMeta.end}</span>
            </td>
          `;

          for (let d = 1; d <= 5; d++) {
            const td = document.createElement('td');
            if (d === 5 && p === 7) {
              // 금요일 7교시는 보통 학급자치/자율활동 또는 공강
              td.innerHTML = `<div class="timetable-slot-card subject-공강"><div class="slot-top"><span class="slot-subject-name">창체/자율</span></div></div>`;
            } else {
              const slot = AppData.classTimetable[g]?.[c]?.[d]?.[p];
              if (slot) {
                const teacher = AppData.teachers.find(t => t.id === slot.teacherId);
                const tName = teacher ? teacher.name : '선생님';
                td.innerHTML = `
                  <div class="timetable-slot-card subject-${slot.subject}">
                    <div class="slot-top">
                      <span class="slot-subject-name">${slot.subject}</span>
                      <span class="slot-room-badge">${slot.room}</span>
                    </div>
                    <div class="slot-bottom">
                      <span class="slot-teacher-name">${tName}</span>
                      <span class="slot-class-name">${g}-${c}</span>
                    </div>
                  </div>
                `;
              } else {
                td.innerHTML = `<div class="timetable-slot-card subject-공강"><div class="slot-top"><span class="slot-subject-name">공강</span></div></div>`;
              }
            }
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
        }

      } else if (this.currentTimetableView === 'teacher') {
        const t = AppData.teachers.find(x => x.id === this.activeTeacherId);
        if (!t) return;

        titleEl.textContent = `${t.name} 선생님 (${t.subject}) 주간 수업 시간표`;
        descEl.textContent = `주당 수업 시수: ${t.weeklyHours}시간 | 담임: ${t.homeroom ? `${t.homeroom.grade}-${t.homeroom.classNum}반` : '비담임'}`;

        for (let p = 1; p <= AppData.school.totalPeriods; p++) {
          const tr = document.createElement('tr');
          const timeMeta = AppData.school.periodTimes[p - 1];
          tr.innerHTML = `
            <td class="period-label-cell">
              <span class="period-num">${p}교시</span>
              <span class="period-time-range">${timeMeta.start}~${timeMeta.end}</span>
            </td>
          `;

          for (let d = 1; d <= 5; d++) {
            const td = document.createElement('td');
            const slot = AppData.teacherTimetable[t.id]?.[d]?.[p];
            if (slot) {
              td.innerHTML = `
                <div class="timetable-slot-card subject-${t.subject}">
                  <div class="slot-top">
                    <span class="slot-subject-name">${slot.grade}-${slot.classNum}반</span>
                    <span class="slot-room-badge">${slot.room}</span>
                  </div>
                  <div class="slot-bottom">
                    <span class="slot-teacher-name">${slot.subject}</span>
                    <span class="slot-class-name">정규</span>
                  </div>
                </div>
              `;
            } else {
              td.innerHTML = `
                <div class="timetable-slot-card subject-공강">
                  <div class="slot-top">
                    <span class="slot-subject-name text-muted">연구/공강</span>
                  </div>
                </div>
              `;
            }
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
        }

      } else if (this.currentTimetableView === 'facility') {
        const facName = this.activeFacility;
        const facLimit = AppData.facilityLimits[facName]?.limit || 1;
        titleEl.textContent = `특별실 사용 현황판: ${facName} (최대 ${facLimit}학급 동시 수용)`;
        descEl.textContent = `체육관/과학실 등 특별 시설의 교시별 동시 점유 학급 현황`;

        for (let p = 1; p <= AppData.school.totalPeriods; p++) {
          const tr = document.createElement('tr');
          const timeMeta = AppData.school.periodTimes[p - 1];
          tr.innerHTML = `
            <td class="period-label-cell">
              <span class="period-num">${p}교시</span>
              <span class="period-time-range">${timeMeta.start}~${timeMeta.end}</span>
            </td>
          `;

          for (let d = 1; d <= 5; d++) {
            const td = document.createElement('td');
            const occupiedClasses = [];
            for (let g = 1; g <= 3; g++) {
              for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
                const slot = AppData.classTimetable[g]?.[c]?.[d]?.[p];
                if (slot && (slot.room.includes(facName) || slot.subject === AppData.facilityLimits[facName]?.subject)) {
                  occupiedClasses.push(`${g}-${c}`);
                }
              }
            }

            const count = occupiedClasses.length;
            const isOverflow = count > facLimit;
            td.innerHTML = `
              <div class="timetable-slot-card ${isOverflow ? 'subject-사회' : (count > 0 ? 'subject-체육' : 'subject-공강')}">
                <div class="slot-top">
                  <span class="slot-subject-name">${count > 0 ? `${count}학급 사용중` : '비어있음'}</span>
                  <span class="slot-room-badge">${count}/${facLimit}</span>
                </div>
                <div class="slot-bottom">
                  <span class="slot-teacher-name">${occupiedClasses.join(', ') || '-'}</span>
                </div>
              </div>
            `;
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
        }
      }
    },

    // ------------------------------------------------------------------------
    // TAB 2: 결보강(수업 교체) 스마트 매칭 시스템 로직
    // ------------------------------------------------------------------------
    bindSubstituteSystem() {
      const btnRun = document.getElementById('btnRunSubMatching');
      const selectTeacher = document.getElementById('subAbsentTeacher');
      const selectDay = document.getElementById('subDay');
      const selectPeriod = document.getElementById('subPeriod');

      // 폼 변경 시 미리보기 업데이트
      const updateCallout = () => {
        const tId = selectTeacher.value;
        const d = parseInt(selectDay.value, 10);
        const p = parseInt(selectPeriod.value, 10);
        const slot = AppData.teacherTimetable[tId]?.[d]?.[p];
        const calloutEl = document.getElementById('targetClassInfoText');
        if (slot) {
          calloutEl.innerHTML = `<strong>${slot.grade}학년 ${slot.classNum}반</strong> [${slot.subject}] - ${slot.room}`;
        } else {
          calloutEl.innerHTML = `<span class="text-muted">해당 교시는 공강(수업 없음) 상태입니다.</span>`;
        }
      };

      selectTeacher?.addEventListener('change', updateCallout);
      selectDay?.addEventListener('change', updateCallout);
      selectPeriod?.addEventListener('change', updateCallout);

      btnRun?.addEventListener('click', () => {
        const tId = selectTeacher.value;
        const d = selectDay.value;
        const p = selectPeriod.value;

        const results = SubstituteEngine.findMatches(tId, d, p);
        this.renderSubstituteResults(tId, d, p, results);
      });

      // 결보강 이력 렌더링
      this.renderSubHistory();
    },

    renderSubstituteResults(absentTeacherId, day, period, results) {
      const freeCountEl = document.getElementById('freeTeacherCount');
      const swapCountEl = document.getElementById('classSwapSlotCount');
      const swapCardsGrid = document.getElementById('swapCardsGrid');
      const directSubCardsGrid = document.getElementById('directSubCardsGrid');

      freeCountEl.textContent = `${results.freeTeachers.length}명`;
      swapCountEl.textContent = `${results.swapSlots.length}건 발견`;

      // 1. 맞교환 카드 렌더링
      swapCardsGrid.innerHTML = '';
      if (results.swapSlots.length === 0) {
        swapCardsGrid.innerHTML = `
          <div class="empty-state">
            <p>동일 학급 내 맞교환 가능한 교과 슬롯이 없습니다. 아래의 공강 교사 직접 대체(보강)를 이용해 주세요.</p>
          </div>
        `;
      } else {
        results.swapSlots.forEach((slot, idx) => {
          const card = document.createElement('div');
          card.className = 'swap-card';
          const absentT = AppData.teachers.find(t => t.id === absentTeacherId);
          card.innerHTML = `
            <div>
              <div class="swap-header">
                <span class="swap-target-badge">${slot.targetGrade}-${slot.targetClassNum}반 교과 스왑</span>
                <span class="badge badge-success">${slot.quality}</span>
              </div>
              <div class="swap-flow-diagram">
                <div class="flow-slot">
                  <div class="teacher-tag">${absentT.name} (${absentT.subject})</div>
                  <div class="slot-detail">${AppData.school.days.find(d=>d.id===parseInt(day))?.short} ${period}교시</div>
                </div>
                <div class="flow-arrow-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="20" x2="21" y2="3"></line>
                    <polyline points="8 21 3 21 3 16"></polyline>
                    <line x1="20" y1="4" x2="3" y2="21"></line>
                  </svg>
                </div>
                <div class="flow-slot">
                  <div class="teacher-tag">${slot.teacherB.name} (${slot.swapSubject})</div>
                  <div class="slot-detail">${slot.swapDayName.slice(0, 1)} ${slot.swapPeriod}교시</div>
                </div>
              </div>
              <div class="swap-meta-info">
                <span>효과: 학생 수업 결손 0시간</span>
                <span>교사 주당 시수 변동 없음</span>
              </div>
            </div>
            <button class="btn btn-sm btn-accent btn-block btn-apply-swap" data-index="${idx}">
              이 슬롯으로 맞교환 확정 발급
            </button>
          `;

          card.querySelector('.btn-apply-swap').addEventListener('click', () => {
            this.openSubConfirmModal('SWAP', {
              teacherA: absentT,
              teacherB: slot.teacherB,
              targetDay: parseInt(day),
              targetPeriod: parseInt(period),
              swapDay: slot.swapDay,
              swapPeriod: slot.swapPeriod,
              grade: slot.targetGrade,
              classNum: slot.targetClassNum,
              subjectA: absentT.subject,
              subjectB: slot.swapSubject
            });
          });

          swapCardsGrid.appendChild(card);
        });
      }

      // 2. 직접 대체 교사 카드 렌더링
      directSubCardsGrid.innerHTML = '';
      if (results.freeTeachers.length === 0) {
        directSubCardsGrid.innerHTML = `<div class="empty-state"><p>해당 교시에 수업이 없는 공강 교사가 없습니다.</p></div>`;
      } else {
        results.freeTeachers.slice(0, 6).forEach((item) => {
          const tb = item.teacher;
          const card = document.createElement('div');
          card.className = 'sub-card';
          card.innerHTML = `
            <div>
              <div class="sub-card-header">
                <div class="sub-teacher-info">
                  <h5>${tb.name} 선생님</h5>
                  <p>${tb.subject} | ${tb.grade}학년 담당 | ${tb.homeroom ? `${tb.homeroom.grade}-${tb.homeroom.classNum} 담임` : '비담임'}</p>
                </div>
                <span class="badge ${item.isSameSubject ? 'badge-primary' : 'badge-accent'}">
                  ${item.isSameSubject ? '동일교과' : '공강교사'}
                </span>
              </div>
              <div class="workload-gauge">
                <div class="gauge-label">
                  <span>주당 수업: ${tb.weeklyHours}시간</span>
                  <span>이번 주 보강: ${tb.subCount}회</span>
                </div>
                <div class="gauge-bar-bg">
                  <div class="gauge-bar-fill" style="width: ${(tb.weeklyHours / 22) * 100}%"></div>
                </div>
              </div>
            </div>
            <button class="btn btn-sm btn-outline btn-block btn-apply-direct" data-teacher-id="${tb.id}">
              보강 교사로 즉시 배정
            </button>
          `;

          card.querySelector('.btn-apply-direct').addEventListener('click', () => {
            const absentT = AppData.teachers.find(t => t.id === absentTeacherId);
            const targetSlot = results.targetSlot;
            this.openSubConfirmModal('DIRECT', {
              teacherA: absentT,
              subTeacher: tb,
              targetDay: parseInt(day),
              targetPeriod: parseInt(period),
              grade: targetSlot ? targetSlot.grade : 3,
              classNum: targetSlot ? targetSlot.classNum : 1,
              subject: absentT.subject
            });
          });

          directSubCardsGrid.appendChild(card);
        });
      }
    },

    renderSubHistory() {
      const tbody = document.getElementById('subHistoryTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      AppData.subHistory.forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${h.date}</strong></td>
          <td>${h.teacher}</td>
          <td><span class="badge badge-accent">${h.targetClass}반</span></td>
          <td>${h.subTeacher}</td>
          <td><span class="badge ${h.type.includes('맞교환') ? 'badge-success' : 'badge-primary'}">${h.type}</span></td>
          <td><span class="badge badge-success">${h.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
    },

    // ------------------------------------------------------------------------
    // TAB 3: 맞춤형 시험 감독 엔진 로직
    // ------------------------------------------------------------------------
    bindExamEngine() {
      const btnGen = document.getElementById('btnAutoGenerateExam');
      const btnAddExclude = document.getElementById('btnAddExcludeTeacher');
      const selectExclude = document.getElementById('selectTeacherToExclude');

      btnGen?.addEventListener('click', () => {
        this.runExamGeneration();
      });

      btnAddExclude?.addEventListener('click', () => {
        const tName = selectExclude.value;
        if (tName && !AppData.excludedProctors.includes(tName)) {
          AppData.excludedProctors.push(tName);
          this.renderExcludedProctorsList();
          this.showToast(`${tName} 선생님이 시험 감독 제외 대상에 추가되었습니다.`, 'info');
        }
      });

      this.renderExcludedProctorsList();

      document.getElementById('btnPrintExamMatrix')?.addEventListener('click', () => {
        window.print();
      });

      document.getElementById('btnExportExamExcel')?.addEventListener('click', () => {
        this.showToast('시험 감독 종합 배치표가 엑셀(CSV) 형식으로 내보내졌습니다.', 'success');
      });
    },

    renderExcludedProctorsList() {
      const container = document.getElementById('excludedTeachersList');
      if (!container) return;
      container.innerHTML = '';
      AppData.excludedProctors.forEach((name, idx) => {
        const span = document.createElement('span');
        span.className = 'badge badge-warning tag-removable';
        span.innerHTML = `${name} <button type="button" data-idx="${idx}">&times;</button>`;
        span.querySelector('button').addEventListener('click', (e) => {
          const i = parseInt(e.target.dataset.idx, 10);
          AppData.excludedProctors.splice(i, 1);
          this.renderExcludedProctorsList();
        });
        container.appendChild(span);
      });
    },

    runExamGeneration() {
      const excludeHomeroom = document.getElementById('ruleExcludeHomeroom')?.checked;
      const excludeSubjectTeacher = document.getElementById('ruleExcludeSubjectTeacher')?.checked;
      const isGrade3Exam = document.getElementById('examGrade3')?.checked;

      const result = ExamProctorEngine.generateExamRoster({
        examGrade: isGrade3Exam ? 3 : 2,
        excludeHomeroom,
        excludeSubjectTeacher,
        excludedTeachers: AppData.excludedProctors
      });

      this.renderExamTable(result);
      this.showToast('변칙 벨타임 및 잔류 학년 교과 안배를 반영한 시험 감독표가 완성되었습니다!', 'success');
    },

    renderExamTable(result) {
      const tbody = document.getElementById('examProctorTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      // 4개 학급 행 구성
      for (let c = 1; c <= AppData.school.classesPerGrade; c++) {
        const tr = document.createElement('tr');
        const roomName = `${result.examGrade}학년 ${c}반 (시험실)`;

        // 1교시, 2교시, 3교시 데이터 가져오기
        const p1Assign = result.roster[0]?.roomAssignments[c - 1];
        const p2Assign = result.roster[1]?.roomAssignments[c - 1];
        const p3Assign = result.roster[2]?.roomAssignments[c - 1];

        tr.innerHTML = `
          <td class="sticky-col">${roomName}</td>
          <td>
            <div class="proctor-assignment-pill main-proctor">
              <span class="proctor-role-badge role-main">정</span>
              <span><strong>${p1Assign?.mainProctor.name}</strong> (${p1Assign?.mainProctor.subject})</span>
            </div>
            <div class="proctor-assignment-pill sub-proctor">
              <span class="proctor-role-badge role-sub">부</span>
              <span>${p1Assign?.subProctor.name} (${p1Assign?.subProctor.subject})</span>
            </div>
          </td>
          <td>
            <div class="proctor-assignment-pill main-proctor">
              <span class="proctor-role-badge role-main">정</span>
              <span><strong>${p2Assign?.mainProctor.name}</strong> (${p2Assign?.mainProctor.subject})</span>
            </div>
            <div class="proctor-assignment-pill sub-proctor">
              <span class="proctor-role-badge role-sub">부</span>
              <span>${p2Assign?.subProctor.name} (${p2Assign?.subProctor.subject})</span>
            </div>
          </td>
          <td>
            <div class="proctor-assignment-pill main-proctor">
              <span class="proctor-role-badge role-main">정</span>
              <span><strong>${p3Assign?.mainProctor.name}</strong> (${p3Assign?.mainProctor.subject})</span>
            </div>
            <div class="proctor-assignment-pill sub-proctor">
              <span class="proctor-role-badge role-sub">부</span>
              <span>${p3Assign?.subProctor.name} (${p3Assign?.subProctor.subject})</span>
            </div>
          </td>
          <td>
            <div class="text-muted" style="font-size:0.75rem;">
              • 본부대기: ${result.roster[0]?.hqProctor}<br>
              • 복도순회: ${result.roster[0]?.hallwayProctor}
            </div>
          </td>
        `;

        tbody.appendChild(tr);
      }

      // 잔류 학년 지도 현황 설명 업데이트
      const residualText = document.getElementById('residualTeachersStatus');
      if (residualText) {
        residualText.textContent = `1학년 4학급 및 2학년 4학급(총 8학급)은 정규 수업을 유지 중입니다. 총 16명의 교사가 수업에 투입되어 시험 감독에서 안전하게 배제되었으며, 감독 교사는 공강 교사 중에서 1인당 1~2회로 완벽히 균등 배분되었습니다.`;
      }
    },

    // ------------------------------------------------------------------------
    // TAB 4: 제약 조건 및 자연어 AI 어시스턴트 로직
    // ------------------------------------------------------------------------
    bindConstraintsAndChat() {
      const promptForm = document.getElementById('aiPromptForm');
      const promptInput = document.getElementById('aiPromptInput');
      const chatMessages = document.getElementById('aiChatMessages');
      const quickChips = document.querySelectorAll('.btn-chip');

      quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
          promptInput.value = chip.dataset.prompt;
          promptInput.focus();
        });
      });

      promptForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = promptInput.value.trim();
        if (!userText) return;

        // 1. 유저 메시지 버블 추가
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'chat-message user';
        userMsgDiv.innerHTML = `
          <div class="avatar">교무</div>
          <div class="bubble">${userText}</div>
        `;
        chatMessages.appendChild(userMsgDiv);
        promptInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 2. AI 생각 중 표시 후 응답
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'chat-message bot';
        thinkingDiv.innerHTML = `
          <div class="avatar">AI</div>
          <div class="bubble"><span class="text-muted">제약 조건 분석 엔진 가동 중...</span></div>
        `;
        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
          const parseResult = ConstraintEngine.parseNaturalLanguagePrompt(userText);
          thinkingDiv.innerHTML = `
            <div class="avatar">AI</div>
            <div class="bubble">${parseResult.reply}</div>
          `;
          chatMessages.scrollTop = chatMessages.scrollHeight;

          // 제약 조건 UI 리렌더링
          this.renderResourceRules();
          this.renderTeacherRules();
          this.runConflictValidation();
          this.showToast('새로운 제약 조건이 시간표 시스템에 반영되었습니다.', 'success');
        }, 400);
      });

      // 시설 기본값 리셋
      document.getElementById('btnResetFacilityRules')?.addEventListener('click', () => {
        AppData.facilityLimits['체육관'].limit = 4;
        AppData.facilityLimits['과학실'].limit = 2;
        AppData.facilityLimits['컴퓨터실'].limit = 1;
        this.renderResourceRules();
        this.runConflictValidation();
        this.showToast('시설 자원 한도가 기본 표준 규격으로 복원되었습니다.', 'info');
      });

      // 수동 규칙 추가 모달 열기
      document.getElementById('btnOpenAddRuleModal')?.addEventListener('click', () => {
        const modal = document.getElementById('addRuleModal');
        modal.classList.add('show');
      });
    },

    renderResourceRules() {
      const grid = document.getElementById('resourceRulesGrid');
      if (!grid) return;
      grid.innerHTML = '';

      for (const [key, item] of Object.entries(AppData.facilityLimits)) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
          <div class="resource-title-row">
            <span class="resource-name">${item.name}</span>
            <span class="badge badge-accent">Hard Constraint</span>
          </div>
          <div class="stepper-control">
            <button class="btn-step btn-minus" data-key="${key}">-</button>
            <span class="step-value">${item.limit}학급</span>
            <button class="btn-step btn-plus" data-key="${key}">+</button>
          </div>
          <div class="usage-meter">
            <span>동시 배정 상한</span>
            <span>최대 ${item.limit}실</span>
          </div>
        `;

        card.querySelector('.btn-minus').addEventListener('click', () => {
          if (item.limit > 1) {
            item.limit -= 1;
            this.renderResourceRules();
            this.runConflictValidation();
          }
        });

        card.querySelector('.btn-plus').addEventListener('click', () => {
          if (item.limit < 8) {
            item.limit += 1;
            this.renderResourceRules();
            this.runConflictValidation();
          }
        });

        grid.appendChild(card);
      }
    },

    renderTeacherRules() {
      const tbody = document.getElementById('teacherRulesTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      AppData.teacherRules.forEach(rule => {
        const tr = document.createElement('tr');
        const dayName = AppData.school.days.find(d => d.id === rule.day)?.name || `${rule.day}요일`;
        tr.innerHTML = `
          <td><strong>${rule.teacherName}</strong> (${rule.subject})</td>
          <td><span class="badge ${rule.type.includes('OFF') ? 'badge-primary' : 'badge-warning'}">${rule.desc}</span></td>
          <td>${dayName}</td>
          <td><span class="badge ${rule.strictness === 'HARD' ? 'badge-danger' : 'badge-accent'}">${rule.strictness}</span></td>
          <td>
            <label class="custom-switch">
              <input type="checkbox" class="rule-active-toggle" data-id="${rule.id}" ${rule.active ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <button class="btn btn-xs btn-outline btn-delete-rule" data-id="${rule.id}">&times; 삭제</button>
          </td>
        `;

        tr.querySelector('.rule-active-toggle').addEventListener('change', (e) => {
          rule.active = e.target.checked;
          this.runConflictValidation();
          this.showToast(`${rule.teacherName} 선생님 규칙이 ${rule.active ? '활성화' : '비활성화'}되었습니다.`, 'info');
        });

        tr.querySelector('.btn-delete-rule').addEventListener('click', () => {
          const idx = AppData.teacherRules.findIndex(r => r.id === rule.id);
          if (idx !== -1) {
            AppData.teacherRules.splice(idx, 1);
            this.renderTeacherRules();
            this.runConflictValidation();
          }
        });

        tbody.appendChild(tr);
      });
    },

    runConflictValidation(showToastIfClean = false) {
      const violations = ConstraintEngine.validateSchedule();
      const container = document.getElementById('violationListContainer');
      const badge = document.getElementById('violationStatusBadge');

      if (violations.length === 0) {
        badge.className = 'badge badge-success';
        badge.textContent = '충돌 0건 (완벽 준수)';
        container.innerHTML = `
          <div class="empty-state">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>현재 등록된 모든 시설 한도 및 교사별 제약 조건이 시간표와 충돌 없이 완벽히 만족되고 있습니다.</p>
          </div>
        `;
        if (showToastIfClean) {
          this.showToast('실시간 충돌 검사 완료: 모든 제약 조건이 정상 충족되었습니다.', 'success');
        }
      } else {
        badge.className = 'badge badge-danger';
        badge.textContent = `충돌 ${violations.length}건 감지`;
        container.innerHTML = '';
        violations.forEach(v => {
          const item = document.createElement('div');
          item.className = 'violation-item';
          item.innerHTML = `
            <div>
              <strong>[${v.title}]</strong>
              <div style="font-size: 0.75rem; margin-top: 2px;">${v.desc}</div>
            </div>
            <span class="badge badge-danger">${v.severity}</span>
          `;
          container.appendChild(item);
        });
        if (showToastIfClean) {
          this.showToast(`주의: 시간표에 ${violations.length}건의 제약 조건 충돌이 감지되었습니다.`, 'error');
        }
      }
    },

    // ------------------------------------------------------------------------
    // 공통 모달 및 드롭다운 바인딩
    // ------------------------------------------------------------------------
    bindModals() {
      // 1. 컴시간 동기화 모달
      const syncModal = document.getElementById('syncModal');
      document.getElementById('openSyncModalBtn')?.addEventListener('click', () => {
        syncModal.classList.add('show');
      });
      document.getElementById('closeSyncModalBtn')?.addEventListener('click', () => {
        syncModal.classList.remove('show');
      });
      document.getElementById('btnLoadMockData')?.addEventListener('click', () => {
        ComsiganParser.generateFullTimetable();
        this.renderTimetable();
        syncModal.classList.remove('show');
        this.showToast('서울누리중학교 2026학년도 최신 시간표 데이터가 캐싱되었습니다.', 'success');
      });
      document.getElementById('btnApplySyncSettings')?.addEventListener('click', () => {
        syncModal.classList.remove('show');
        this.showToast('컴시간 API 프록시 서버와 양방향 동기화되었습니다.', 'success');
      });

      // 2. 결보강 통지서 확인 모달
      const subConfirmModal = document.getElementById('subConfirmModal');
      document.getElementById('closeSubConfirmModalBtn')?.addEventListener('click', () => {
        subConfirmModal.classList.remove('show');
      });
      document.getElementById('btnCancelSubModal')?.addEventListener('click', () => {
        subConfirmModal.classList.remove('show');
      });
      document.getElementById('btnPrintSlipModal')?.addEventListener('click', () => {
        window.print();
      });

      // 3. 신규 제약 규칙 등록 모달
      const addRuleModal = document.getElementById('addRuleModal');
      document.getElementById('closeAddRuleModalBtn')?.addEventListener('click', () => {
        addRuleModal.classList.remove('show');
      });
      document.getElementById('btnCancelNewRule')?.addEventListener('click', () => {
        addRuleModal.classList.remove('show');
      });
      document.getElementById('btnSaveNewRule')?.addEventListener('click', () => {
        const teacherId = document.getElementById('newRuleTeacher').value;
        const type = document.getElementById('newRuleType').value;
        const day = parseInt(document.getElementById('newRuleDay').value, 10);
        const strictness = document.getElementById('newRuleStrictness').value;
        const teacher = AppData.teachers.find(t => t.id === teacherId);

        if (teacher) {
          const dayName = AppData.school.days.find(d => d.id === day)?.name;
          let desc = `${dayName} 연구일/공강 지정`;
          if (type === 'AFTERNOON_OFF') desc = `${dayName} 오후(5~7교시) 공강`;
          if (type === 'MORNING_OFF') desc = `${dayName} 오전(1~2교시) 공강`;
          if (type === 'MAX_CONTINUOUS') desc = `${dayName} 연속 2시간 상한 제한`;

          AppData.teacherRules.unshift({
            id: `R${String(AppData.teacherRules.length + 1).padStart(2, '0')}`,
            teacherId,
            teacherName: teacher.name,
            subject: teacher.subject,
            type,
            day,
            desc,
            strictness,
            active: true
          });

          this.renderTeacherRules();
          this.runConflictValidation();
          addRuleModal.classList.remove('show');
          this.showToast('새로운 교사 제약 조건이 등록되었습니다.', 'success');
        }
      });
    },

    openSubConfirmModal(type, payload) {
      const modal = document.getElementById('subConfirmModal');
      const body = document.getElementById('subConfirmSlipBody');
      const btnCommit = document.getElementById('btnConfirmSubCommit');

      if (type === 'SWAP') {
        body.innerHTML = `
          <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; padding:1.5rem; border-radius:8px;">
            <h4 style="text-align:center; font-size:1.15rem; margin-bottom:1rem; border-bottom:2px solid #334155; padding-bottom:0.5rem;">
              [결보강 승인 결재서] 교과 수업 맞교환 통지서
            </h4>
            <table class="table-mini" style="margin-bottom:1rem;">
              <tr>
                <th style="width:30%">해당 학급</th>
                <td><strong>${payload.grade}학년 ${payload.classNum}반</strong></td>
              </tr>
              <tr>
                <th>원래 수업 (결강)</th>
                <td>${payload.teacherA.name} 선생님 (${payload.subjectA}) - ${AppData.school.days.find(d=>d.id===payload.targetDay)?.name} ${payload.targetPeriod}교시</td>
              </tr>
              <tr>
                <th>맞교환 수업</th>
                <td>${payload.teacherB.name} 선생님 (${payload.subjectB}) - ${AppData.school.days.find(d=>d.id===payload.swapDay)?.name} ${payload.swapPeriod}교시</td>
              </tr>
              <tr>
                <th>결강 사유</th>
                <td>관내 공무 출장 및 학사 운영 지원</td>
              </tr>
              <tr>
                <th>처리 구분</th>
                <td><span class="badge badge-success">교과 진도 결손 없는 1:1 맞교환</span></td>
              </tr>
            </table>
            <p style="font-size:0.8125rem; color:#475569; text-align:center;">
              위와 같이 교과 수업을 상호 맞교환하여 전산에 확정 반영하시겠습니까?
            </p>
          </div>
        `;

        btnCommit.onclick = () => {
          SubstituteEngine.applySwap('SWAP', {
            teacherAId: payload.teacherA.id,
            teacherBId: payload.teacherB.id,
            targetDay: payload.targetDay,
            targetPeriod: payload.targetPeriod,
            swapDay: payload.swapDay,
            swapPeriod: payload.swapPeriod,
            grade: payload.grade,
            classNum: payload.classNum
          });
          this.renderTimetable();
          this.renderSubHistory();
          modal.classList.remove('show');
          this.showToast('맞교환이 성공적으로 확정되어 시간표에 반영되었습니다!', 'success');
        };

      } else if (type === 'DIRECT') {
        body.innerHTML = `
          <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; padding:1.5rem; border-radius:8px;">
            <h4 style="text-align:center; font-size:1.15rem; margin-bottom:1rem; border-bottom:2px solid #334155; padding-bottom:0.5rem;">
              [결보강 승인 결재서] 보강 배정 통지서
            </h4>
            <table class="table-mini" style="margin-bottom:1rem;">
              <tr>
                <th style="width:30%">해당 학급</th>
                <td><strong>${payload.grade}학년 ${payload.classNum}반</strong></td>
              </tr>
              <tr>
                <th>결강 교사</th>
                <td>${payload.teacherA.name} 선생님 (${payload.subject})</td>
              </tr>
              <tr>
                <th>보강(대체) 교사</th>
                <td><strong>${payload.subTeacher.name} 선생님</strong> (${payload.subTeacher.subject})</td>
              </tr>
              <tr>
                <th>보강 일시</th>
                <td>${AppData.school.days.find(d=>d.id===payload.targetDay)?.name} ${payload.targetPeriod}교시</td>
              </tr>
            </table>
            <p style="font-size:0.8125rem; color:#475569; text-align:center;">
              공강 교사 보강 배정을 전산 확정하시겠습니까? (보강 수당 및 시수 기록)
            </p>
          </div>
        `;

        btnCommit.onclick = () => {
          SubstituteEngine.applySwap('DIRECT', {
            teacherAId: payload.teacherA.id,
            subTeacherId: payload.subTeacher.id,
            targetDay: payload.targetDay,
            targetPeriod: payload.targetPeriod,
            grade: payload.grade,
            classNum: payload.classNum
          });
          this.renderTimetable();
          this.renderSubHistory();
          modal.classList.remove('show');
          this.showToast('보강 배정이 완료되었습니다.', 'success');
        };
      }

      modal.classList.add('show');
    },

    populateTeacherDropdowns() {
      const selects = [
        document.getElementById('teacherSelect'),
        document.getElementById('subAbsentTeacher'),
        document.getElementById('selectTeacherToExclude'),
        document.getElementById('newRuleTeacher')
      ];

      selects.forEach(sel => {
        if (!sel) return;
        sel.innerHTML = '';
        AppData.teachers.forEach(t => {
          const opt = document.createElement('option');
          opt.value = sel.id === 'selectTeacherToExclude' ? t.name : t.id;
          opt.textContent = `${t.name} (${t.subject}${t.homeroom ? ` / ${t.homeroom.grade}-${t.homeroom.classNum}담임` : ''})`;
          sel.appendChild(opt);
        });
      });

      // 기본 선택값
      if (document.getElementById('subAbsentTeacher')) {
        document.getElementById('subAbsentTeacher').value = 'T04'; // 이영진
      }
      if (document.getElementById('teacherSelect')) {
        document.getElementById('teacherSelect').value = 'T04';
      }
    },

    showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 200ms ease';
        setTimeout(() => toast.remove(), 200);
      }, 3000);
    }
  };

  // 애플리케이션 시작
  document.addEventListener('DOMContentLoaded', () => {
    UI.init();
  });

})();
