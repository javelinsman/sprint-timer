# Visual Analysis and Dissemination of Scientific Literature Collections with SurVis

## Overview

### Problem Statement
문헌 조사(literature survey)를 작성하는 연구자들은 수백 개의 참고문헌을 수집하고 구조화해야 하지만, 기존의 참고문헌 목록은 단순한 리스트 형태로만 제공되어 깊이 있는 분석이 어렵다. 또한 문헌 조사의 독자들도 수집된 문헌 컬렉션을 효과적으로 탐색하고 분석할 수 있는 도구가 부족하다.

### Approach
저자들은 문헌 컬렉션을 시각적으로 분석하고 배포할 수 있는 웹 기반 시각 분석 시스템인 SurVis를 개발했다. 이 시스템은 다양한 선택자(selector) 개념과 sparkline 시각화를 통해 문헌 간의 관계를 보여주며, 큐레이터(문헌 조사 작성자)와 독자 모두를 위한 도구로 설계되었다.

### Contribution
SurVis는 문헌 데이터의 시각적 분석뿐만 아니라 배포(dissemination)에도 중점을 둔 최초의 시스템으로, selector agreement의 sparkline 시각화라는 새로운 접근법을 도입했다. 또한 문헌 조사의 저자와 독자 양쪽의 분석적 추론 과정을 지원하는 통합 시스템을 제공한다.

## Introduction
연구는 이전 연구를 기반으로 하며, 특히 문헌 조사 출판물에서는 참고문헌이 중요하다. 그러나 일반적으로 수백 개가 넘는 참고문헌은 단순한 목록 형태로는 분석하기 어렵다. 저자들은 참고문헌 컬렉션을 대화형으로 탐색할 수 있고 추가 데이터로 보강하여 (i) 유사한 연구 과제를 다루는 출판물을 검색하고, (ii) 연구 분야의 역사적 발전과 최근 진전을 분석하며, (iii) 해당 분야의 전문가와 영향력 있는 출판물을 식별할 수 있도록 하는 것이 중요하다고 주장한다.

## Related Work
문헌 브라우저는 Treevis.net과 Timeviz.net을 시작으로 시각화 커뮤니티에서 문헌 컬렉션을 배포하는 인기 있는 도구가 되었다. 이들은 주로 썸네일 이미지 그리드로 시각화 기법을 제시한다. PivotPaths는 facet 필터를 저자, 출판물, 키워드의 노드-링크 표현과 결합했고, Keshif는 faceted search를 키워드 빈도와 시간적 맥락에 대한 시각화로 보강했다. 더 복잡한 시스템으로는 CiteWiz, PaperCube, Action Science Explorer 등이 있지만, 이들은 일반적으로 광범위한 청중에게 문헌 컬렉션을 배포하기에는 단순성과 평탄한 학습 곡선이 부족하다.

## Visualizations in SurVis

### 1. Timeline Visualization
- **목적**: 문헌 컬렉션의 역사적 발전에 대한 연간 개요 제공 (RQ 3a)
- **구성요소**:
  - 상단 막대: 연도별 출판물 수를 요약 (RQ 3c)
  - 하단 쌓인 박스: 컬렉션 내에서 가장 많이 인용된 출판물을 시각화
  - 박스 배경의 어두운 정도: 인용 빈도를 인코딩 (색상 스케일 범례 제공) (RQ 3d)
- **상호작용**: -/+ 버튼으로 표시할 최소 인용 수 조정 가능
- **도움이 되는 측면**: 연구 분야의 시간적 진화 파악, 영향력 있는 논문의 시대적 분포 확인

### 2. Word Cloud Visualizations
- **목적**: 출판물 집합의 키워드를 요약하여 표시 (RQ 2a)
- **특징**:
  - 글꼴 크기가 빈도를 나타냄 (아래첨자로 정확한 값 표시) (RQ 2c)
  - 키워드뿐만 아니라 저자, 출판 시리즈 등 다른 메타정보도 각각 별도의 word cloud로 표시 (RQ 2d)
  - 키워드 카테고리별로 서브 클라우드로 분리
- **상호작용**: 
  - -/+ 버튼으로 최소 빈도 조정
  - 검색 필드로 용어 필터링
  - 마우스 호버 시 툴팁으로 키워드/카테고리 설명 표시
- **도움이 되는 측면**: 문헌 컬렉션의 주요 주제와 구조 파악, 저자 분포 확인

### 3. Sparkline Visualizations
- **목적**: 선택자(selector)에 대한 개체들의 일치도(agreement)를 시각화
- **디자인**: 
  - 단어 크기의 미니어처 막대 차트
  - 각 막대는 하나의 선택자에 대한 일치도를 나타냄 (y축: 0-1 범위)
  - 6가지 색상의 범주형 스케일 사용 (ColorBrewer 기반)
- **통합 위치**:
  - Word clouds 내의 각 용어 옆
  - 출판물 목록의 각 항목 옆
  - 확대된 다이어그램은 툴팁으로 제공
- **도움이 되는 측면**: 선택자 간의 관계 분석, 집합 중첩과 유사성 파악

### 4. Enriched Timeline Visualization
- **목적**: 선택자를 역사적 맥락에서 표현
- **특징**:
  - 연도별 막대를 선택자별 색상 막대로 세분화 (시간에 따른 선택자 일치도 진화 표시)
  - Citation selector 활성화 시: 선택된 출판물 박스를 선택자 색상으로 채움
  - 들어오는/나가는 인용에 따라 박스의 오른쪽/왼쪽 부분을 색상으로 표시
- **도움이 되는 측면**: 시간적 추세 검색, 인용 패턴의 시간적 변화 분석

### 5. Cluster Visualization
- **목적**: 현재 선택된 출판물을 자동으로 그룹화 (RQ 4b)
- **방법**: k-means 클러스터링 알고리즘 기반
- **표시 방식**:
  - Word cloud와 유사한 형태
  - 글꼴 크기는 클러스터에 포함된 출판물 수에 따라 조정
  - 각 클러스터의 특징적인 용어는 tf-idf 측정값으로 결정
- **도움이 되는 측면**: 문헌 컬렉션 내의 자연스러운 그룹 발견, 주제별 분류

## Discussion
저자들은 SurVis가 초기에 설정한 요구사항들을 충족한다는 것을 14명의 시각 분석 전문가들을 대상으로 한 설문조사를 통해 확인했다. 특히 Timeline 시각화가 가장 높은 평가를 받았으며 (평균 4.3/5), 선택자에 대한 시간적 비교가 핵심 기능으로 언급되었다. Sparkline 시각화는 선택자 간의 상관관계를 보여주는 데 유용하다고 평가받았다. 그러나 일부 전문가들은 word cloud 사용에 대한 일반적인 의구심을 표현했으며, 더 컴팩트한 표현을 원하는 의견도 있었다. 전반적으로 SurVis는 문헌 데이터의 탐색과 시각적 분석을 지원하는 강력한 기능을 가진 것으로 평가되었다.

## BibTeX Entry
```bibtex
@article{beck2015visual,
  title={Visual analysis and dissemination of scientific literature collections with SurVis},
  author={Beck, Fabian and Koch, Sebastian and Weiskopf, Daniel},
  journal={IEEE Transactions on Visualization and Computer Graphics},
  volume={22},
  number={1},
  pages={180--189},
  year={2015},
  publisher={IEEE}
}
```