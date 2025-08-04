# VisualBib: A novel Web app for supporting researchers in the creation, visualization and sharing of bibliographies

## Overview

### Problem Statement
연구자들이 특정 연구 주제에 대한 참고문헌을 탐색하고 저장하는 과정에서, 대부분의 서지 데이터베이스는 논문 간의 관계(공저자, 공동 인용, 출판 시간 순서 등)를 파악하기 어려운 긴 목록 형태로 결과를 제시한다. 또한 여러 검색 결과를 통합하고 중복을 제거하는 작업에 상당한 수작업이 필요하다.

### Approach
VisualBib는 네 개의 서지 데이터베이스(Scopus, OpenCitations, CrossRef/Orcid)와 실시간으로 연동하여 논문과 저자 정보를 검색하고, 이를 'narrative view'라는 혁신적인 시각화 방식으로 표현하는 웹 애플리케이션이다. zz-structures라는 의미론적 비계층적 데이터 모델을 사용하여 서지정보와 시각화를 공식적으로 모델링했다.

### Contribution
실시간으로 여러 서지 데이터베이스를 통합하여 검색하고, 서지정보의 의미적 연결을 강조하는 interactive narrative view를 제공하며, 클라우드 기반 서지정보 공유 기능을 구현했다. 93명의 참가자를 대상으로 한 평가에서 Scopus 대비 작업 수행 시간과 사용성 면에서 유의미한 개선을 보였다.

## Introduction
연구자들의 일반적인 작업 중 하나는 특정 연구 주제에 대한 과학 문헌을 탐색하고 재사용 가능한 형식으로 중요한 참고문헌을 생성하고 저장하는 것이다. 검색은 일반적으로 Scopus, Web of Science, CrossRef 등의 대형 인용 색인에서 키워드, 제목, 저자명을 지정하여 수행된다. 하지만 결과는 일반적으로 긴 항목 목록으로 제시되어 논문 간의 관계나 특정 저자의 생산성을 파악하기 어렵다. VisualBib는 이러한 문제를 해결하기 위해 시각적 표현, 서지정보 생성 지원, 서지정보 공유라는 세 가지 주요 목적을 가지고 개발되었다.

## Related Work
기존 시각화 도구들(CiteSpace, VOSviewer 등 10개 도구 분석)은 대부분 사전 구축된 정적 데이터셋을 사용하며, 실시간 데이터 통합을 지원하지 않는다. 또한 대부분이 독립형 애플리케이션으로 다운로드와 설치가 필요하다. 기존 서지 데이터베이스들(AMiner, Google Scholar, Scopus 등 10개 분석)은 일부 메트릭에 대한 제한적인 시각화만 제공하며, 서지정보 전체에 대한 포괄적인 시각화나 실시간 저자 비교 기능을 제공하지 않는다. VisualBib는 실시간 데이터 검색, 다중 소스 통합, 동적 서지정보 관리라는 점에서 기존 도구들과 차별화된다.

## Basic functionalities and some screenshots of VisualBib

### Narrative View - 핵심 시각화
Narrative view는 2차원 공간으로 구성된다:
- **수평 차원(시간)**: 연도별로 구분된 타임라인
- **수직 차원(공간)**: 저자명, 논문, 관계를 적절히 배치

**시각적 요소들**:
- **저자**: 각 저자는 goldenrod 색상의 선으로 표현되며, 이 선은 해당 저자의 모든 논문을 시간순으로 연결
- **논문**: 색상이 있는 둥근 모서리 사각형 아이콘으로 표현
  - 파란색: 완전히 로드된 논문
  - 회색: 부분적으로 로드된 논문
  - 자홍색: 사용자 상호작용 중 의미적 관계 강조
  - 녹색: 텍스트 검색으로 찾은 논문
- **논문 유형**: 세 가지 다른 아이콘으로 구분
  - 저널 논문
  - 책 또는 책 챕터
  - 컨퍼런스 또는 워크샵 프로시딩

### Visual Analytics 기능들

1. **시간에 따른 논문 분포**: 타임라인 위의 히스토그램이 연도별 논문 수를 표시하고, 위에 겹쳐진 area chart가 세 가지 출판 유형의 빈도를 보여줌

2. **인용 네트워크**: 논문 아이콘의 four-arrows 아이콘을 클릭하면 해당 논문을 인용한 논문들과 해당 논문이 인용한 논문들의 목록을 표시. 선택한 논문들은 파란색 점선으로 인용 관계가 시각화됨

3. **저자 생산성 및 협업 메트릭**: 
   - 저자 이름을 클릭하면 해당 저자의 모든 논문이 자홍색으로 강조
   - 저자 이름 옆 괄호 안의 숫자는 현재 서지정보에서 해당 저자의 논문 수를 표시
   - 다른 저자들의 경우 선택된 저자와의 공동 논문 수를 표시

4. **다중 저자 선택 및 공동 저술**: 여러 저자를 선택하면 공동 저술한 논문들이 자홍색으로 강조되고, 선택된 저자들과의 협업 논문 수가 각 이름 옆에 표시

5. **관련 논문**: 논문 아이콘 위에 마우스를 올리면 인용/피인용 논문 네트워크와 공저자들의 경로가 강조됨

## Data analysis
VisualBib가 지원하는 저수준 데이터 분석 작업들을 10개의 주요 서지 데이터베이스와 비교했다. 작업들은 다음을 포함한다: 저자의 논문 찾기, 공동 저술 논문 얻기, 키워드로 논문 찾기, 논문의 인용 및 참고문헌 보기, 저자 협업 네트워크 보기, 요약 데이터 얻기, 연도별 논문 수, 연도별 논문 정렬, 문서 유형 분포 보기 등. 대부분의 색인은 이러한 작업을 부분적으로만 지원하는 반면, VisualBib는 시각적 상호작용을 통해 모든 작업을 지원한다.

## Introducing zz-structures and modelling VisualBib
VisualBib는 zz-structures라는 맥락적 데이터 구조를 사용하여 모델링되었다. zz-structures는 본질적으로 비계층적이고 그래프 중심적인 데이터 및 컴퓨팅 규칙 시스템이다. Visual Bibliography는 저자(A), 논문(P), 세부사항(DE), 인용된 논문(PC), 인용하는 논문(CP)의 집합으로 구성되며, 이들은 저자 차원, 시간 차원, 인용 차원, 세부사항 차원 등 다양한 차원으로 연결된다.

## Zz-views in VisualBib
두 가지 새로운 뷰가 공식적으로 정의되었다:
1. **Deep view**: compound cell에 포함된 논문들과 특정 논문 간의 연결을 확장하여 보여주는 뷰. 예를 들어 인용 관계를 시각적으로 확장하여 표시
2. **Narrative view**: 시간 차원을 수평축으로, 저자와 논문의 관계를 수직 공간에 배치하여 전체적인 서지정보의 이야기를 시각적으로 전달하는 뷰

## Architecture and Implementation
VisualBib는 HTML5, CSS3, SVG, JavaScript ES6 기반의 단일 페이지 웹 애플리케이션이다. D3.js 라이브러리를 사용하여 인터랙티브 시각화를 구현했다. 시스템은 데이터 제공자 모듈, AJAX 요청 관리, 메타데이터 추출 및 동질화, 데이터 병합 및 필터링, 내부 데이터셋, 그래픽 엔진, 로컬 모듈, 클라우드 서비스 등으로 구성된다.

## User evaluation
93명의 참가자를 대상으로 VisualBib와 Scopus의 비교 평가를 수행했다. 5가지 정량적 검색 작업(가장 생산적인 연도 찾기, 협업 논문 수 찾기, 자기 인용 찾기 등)에서 VisualBib가 Scopus보다 유의미하게 빠른 수행 시간을 보였다. SUS 사용성 평가에서도 VisualBib(평균 67.8)가 Scopus(평균 43.11)보다 높은 점수를 받았다. 사용자들은 특히 VisualBib의 혁신적인 그래픽 레이아웃과 시각적 분석 기능을 높이 평가했다.

## Discussion
평가 결과는 VisualBib의 시각적 접근법이 전통적인 목록 기반 인터페이스보다 특정 서지 검색 작업에서 더 효과적임을 보여준다. 특히 저자 간 협업 관계, 시간에 따른 출판 패턴, 인용 네트워크 등을 파악하는 작업에서 narrative view의 장점이 두드러졌다. 하지만 일부 참가자들이 서지 검색 작업 자체에 어려움을 겪어 전체적인 SUS 점수가 상대적으로 낮게 나타난 점은 향후 개선이 필요한 부분이다.

## BibTeX Entry
```bibtex
@article{dattolo2019visualbib,
  title={VisualBib: A novel Web app for supporting researchers in the creation, visualization and sharing of bibliographies},
  author={Dattolo, Antonina and Corbatto, Marco},
  journal={Knowledge-Based Systems},
  volume={182},
  pages={104858},
  year={2019},
  publisher={Elsevier},
  doi={10.1016/j.knosys.2019.07.031}
}
```