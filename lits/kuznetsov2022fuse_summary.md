# Fuse: In-Situ Sensemaking Support in the Browser

## Overview
### Problem Statement
사람들은 온라인에서 정보를 수집하고 정리하며 의사결정을 내리는 데 상당한 시간을 소비한다. 현재의 도구들은 정보 수집과 정리를 별개의 활동으로 다루어 상당한 마찰을 발생시킨다. 브라우저 탭, 복사-붙여넣기, 외부 스프레드시트 등을 사용하는 과정에서 context switching 비용이 크고, 사용자의 mental context가 어디에도 외부화되지 않아 손실되는 문제가 있다.

### Approach
브라우저가 사용자의 mental workspace의 원활한 확장으로 작동할 수 있도록 하는 in-situ workspace를 제공하는 접근법을 채택했다. 브라우징, 수집, 정리 작업 간의 간극을 유연하게 연결하는 항상 사용 가능한 사이드바 형태의 브라우저 확장 프로그램을 개발했다.

### Contribution
(1) 낮은 비용의 수집과 경량 정리 기능을 결합한 카드 기반 사이드바를 제공하는 브라우저 확장 프로그램 Fuse 프로토타입, (2) 이러한 기능들이 사용자가 mental structure를 시스템에 외부화하는 데 어떻게 도움이 되는지에 대한 분석, (3) 22개월간의 공개 배포와 후속 인터뷰를 통한 실제 사용자들의 정보 수집 작업에서의 구조화 행동에 대한 종단적 통찰.

## Introduction
온라인 정보 수집과 의미 만들기(sensemaking)는 쇼핑, 건강, 여행, 문제 해결 등 다양한 작업에서 발생한다. 사용자들이 머릿속에서는 유연하게 정보를 수집하고 정리할 수 있지만, 온라인 sensemaking에 관련된 정보의 양이 작업 기억의 한계를 빠르게 초과한다. 기존 도구들은 수집과 정리를 분리하여 다루어 상당한 마찰을 발생시킨다. Fuse는 브라우저가 사용자의 mental workspace의 원활한 확장으로 작동하는 상호작용 패러다임을 탐구한다.

## Related Work
웹 콘텐츠 클리핑 도구들은 특정 미디어 타입(이미지, 텍스트) 추출에 초점을 맞추거나 구조화된 추출을 활용했다. In-situ sensemaking 지원 시스템들은 문헌 검토, 웹 검색 인터페이스, 데스크톱 애플리케이션 등 다양한 맥락에서 탐구되었다. CiteSense는 문헌 검토 영역에서 독립형 Java 애플리케이션으로 구현되었고, List-it, Clipper, ForSense, Threddy 같은 브라우저 확장 프로그램들은 제한된 정리 기능(최대 한 단계 그룹화)만 제공하며 수집된 콘텐츠를 보고 상호작용하려면 다른 탭이나 애플리케이션으로 전환해야 했다.

## System Design
### Core Features
1. **Collection Features (D1: Collecting content while encoding provenance and context)**
   - Text Highlighting: 고정밀 텍스트 선택 후 컨텍스트 메뉴로 수집
   - Image Drag and Drop: 이미지를 Fuse 프로젝트로 드래그하여 자동으로 카드 생성
   - Bookmarking: 전체 페이지, 제목, URL 저장 및 현재 뷰포트 캡처
   - Bounding Box Clipping: 텍스트나 이미지가 아닌 웹페이지 부분 캡처
   - Tab Importing: 현재 열린 모든 탭을 연속적으로 가져오기

2. **Organization Features (D2: In-situ organizing)**
   - 항상 사용 가능한 사이드바 패널에서 여러 프로젝트 생성, 관리, 전환
   - 카드를 'container cards'로 사용하여 관련 정보 번들링
   - 전통적인 폴더 카드로 명시적 계층 구조 생성
   - 카드 간 드래그 앤 드롭으로 구조 재배열

3. **Visual Compression Features (D3: Visually compressing items)**
   - 각 수집된 콘텐츠를 컴팩트한 카드 UI로 표현
   - 헤더 미리보기 이미지, 제목, 소스 URL, 주석 표시
   - 카드 내 카드 중첩으로 여러 증거 조각을 하나의 카드로 압축
   - 'Peek' 상호작용으로 컨테이너 카드 내부 항목 미리보기
   - 확장된 'reader view'로 모든 중첩된 항목 평면화하여 빠른 스크롤

## Field Deployment Study
22개월간 134명의 사용자가 참여했으며, 89명(66%)이 실제 콘텐츠가 있는 프로젝트를 생성했다. 사용자들은 개인적 작업(쇼핑)과 전문적 작업(학술 문헌 검토) 모두에 Fuse를 사용했다.

## Results
### Usage Patterns
사용자들은 다섯 가지 주요 의도로 프로젝트를 생성했다:
1. **Understanding a subject (59%)**: 주제 연구를 위한 리소스 수집
2. **Comparing items (23%)**: 구매 결정을 위한 항목/서비스 비교
3. **Building a Self-Reference (40%)**: 문서의 긴 요약 생성 및 핵심 콘텐츠 추출
4. **Accessing resources quickly (35%)**: 빠른 접근을 위한 북마킹
5. **Task Management (14%)**: 작업 진행 상황 문서화

### Key Findings
- 사용자들은 낮은 마찰로 웹에서 핵심 콘텐츠를 빠르게 수집할 수 있었다
- 자동 및 수동 출처 정보 수집을 통한 컨텍스트 임베딩 기능을 높이 평가했다
- 49%의 사용자가 주석을 생성했으며, 주로 문서에서 추출한 텍스트나 요약을 포함했다
- 83%의 사용자가 카드를 재정렬했고, 42%가 계층 구조를 생성했다
- Container cards는 전통적인 폴더와 비슷한 빈도(50% vs 46%)로 사용되었다

## Discussion
Fuse는 콘텐츠 수집과 정리를 엮어내는 애플리케이션이 온라인 작업에서 웹 콘텐츠를 종합하려는 사용자에게 도움이 될 수 있음을 보여준다. 시각적 카드와 공간적 조직이 브라우저 사용자가 처리하기 쉬워 작업 기억을 확장하는 데 도움이 되었다. 컴팩트한 카드 디자인과 중첩 기능은 사용자가 더 많은 항목을 포함하는 표현을 구축할 수 있게 했다.

## BibTeX Entry
```bibtex
@inproceedings{kuznetsov2022fuse,
  title={Fuse: In-Situ Sensemaking Support in the Browser},
  author={Kuznetsov, Andrew and Chang, Joseph Chee and Hahn, Nathan and Rachatasumrit, Napol and Breneisen, Bradley and Coupland, Julina and Kittur, Aniket},
  booktitle={The 35th Annual ACM Symposium on User Interface Software and Technology},
  pages={1--15},
  year={2022}
}
```