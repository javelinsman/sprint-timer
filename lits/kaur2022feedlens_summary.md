# FeedLens: Polymorphic Lenses for Personalizing Exploratory Search over Knowledge Graphs

## Overview
### Problem Statement
지식 그래프(Knowledge Graph)의 방대한 규모와 개방형 특성으로 인해 사용자들의 탐색적 검색(exploratory search)이 인지적으로 부담스러운 작업이 되고 있다. 특히 과학 문헌 탐색에서 연구자들은 관련 논문을 찾고, 저자를 발견하며, 분야를 이해하기 위해 반복적이고 개방형인 검색 과정을 거쳐야 한다.

### Approach
FeedLens는 기존 추천 시스템의 사용자 선호 모델(research feeds)을 "polymorphic lenses"로 재활용하여 논문뿐만 아니라 저자, 학회, 기관 등 다양한 유형의 엔티티에 대한 탐색을 지원한다. 이 시스템은 Semantic Scholar 위에 구축되어 기존 인터페이스에 새로운 시각화와 순위 기능을 추가한다.

### Contribution
저자들은 polymorphic lenses라는 새로운 기법을 제시하여 기존 선호 모델을 다양한 엔티티 타입에 적용할 수 있음을 보였다. 사용자 연구 결과 FeedLens는 인지적 부담을 줄이면서도 사용자 참여도를 4배 증가시켰으며, 특히 저자 중심 기능에 대한 참여도는 20배 증가했다.

## Introduction
세계의 정보가 텍스트 소스에서 지식 그래프로 이동하면서 탐색적 검색도 이러한 반구조화된 소스에서 점점 더 많이 수행되고 있다. 2016년 구글의 지식 그래프는 700억 개의 사실을 포함하고 있으며 월 1000억 건의 검색 중 약 3분의 1에 답변을 제공했다. 탐색적 검색은 사용자가 지속적으로 지식을 습득하고, 이를 종합하여 관련성을 정의하고, 동적인 관련성 개념에 기반하여 검색 결과를 평가하는 반복적인 과정이 필요하다. FeedLens는 이러한 기존 개인화된 선호 모델을 활용하여 지식 그래프의 모든 부분에 대한 탐색적 검색을 개선한다.

## Related Work
탐색적 검색에 대한 인간 피드백 캡처는 크게 단일 검색 세션에 적용되는 방법과 시간이 지남에 따라 사용자 선호 모델을 유지하는 방법으로 분류할 수 있다. Faceted search는 지식 그래프의 엔티티에 대해 자동으로 추출된 개념적 차원(예: 과학 문헌의 저자, 출판 장소, 출판 연도)을 기반으로 쿼리 기반 검색 결과를 필터링한다. 개인화된 탐색적 검색 시스템은 시간이 지남에 따라 사용자 피드백을 수집하고 그에 따라 검색 경험을 형성한다. SearchLens는 사용자 정의 렌즈(가중 키워드의 재사용 가능한 컬렉션)로 이러한 형태의 명시적 피드백을 확장했다. FeedLens는 이를 두 가지 주요 측면에서 발전시켰다: 기존 선호 모델을 재사용하여 사용자의 작업을 절약하고, 이를 polymorphic lenses로 적용하여 지식 그래프의 여러 유형의 엔티티에 대한 탐색적 검색을 지원한다.

## Polymorphic Lenses Technique
Polymorphic lenses는 기본 엔티티 타입(논문)에 대해 정의된 렌즈를 지식 그래프의 다른 관련 타입이나 엔티티 컬렉션에 대한 렌즈로 확장한다. 예를 들어, 논문에 대한 사용자 선호도를 저자나 학회의 선호도로 변환할 수 있다. 공식적으로 Pi(b) → [0, 1]이 기본 엔티티 b에 대한 선호 모델이라면, 다른 엔티티 타입 T에 대한 polymorphic lens는 PiT(t) = fa({Pi(b) | b ∈ R(t, b)})로 정의된다. FeedLens는 집계 함수로 fcount-over-threshold를 사용하여 임계값을 초과하는 선호 기본 엔티티의 수를 추정한다.

## Visualization-Based Literature Review Support Features

### 1. Author Overview and Explanations (저자 개요 및 설명)
- **시각화**: 막대 차트를 사용하여 저자의 관련성을 시각화
- **내용**: 각 저자가 보유한 관련 논문의 수를 [0-20+] 범위로 표시
- **상호작용**: 막대 위에 마우스를 올리면 원시 관련 논문 수와 저자가 관련성 있는 이유에 대한 설명 제공
- **지원 측면**: 저자의 연구 관련성을 빠르게 평가하고 비교할 수 있도록 지원

### 2. Paper Relevance Scores and Explanations (논문 관련성 점수 및 설명)
- **시각화**: 관련성이 0.5 이상인 논문에 색상이 지정된 사각형과 점수 표시
- **내용**: [0.5-1] 범위의 관련성 점수를 시각적 신호와 함께 표시
- **상호작용**: 사각형 위에 마우스를 올리면 논문의 관련성 점수에 대한 설명 제공
- **지원 측면**: 논문 목록에서 관련 논문을 빠르게 식별할 수 있도록 지원

### 3. Author Recommendations (저자 추천)
- **시각화**: 관련 저자 이름 옆에 녹색 원(green circles) 표시
- **내용**: 5개 이상의 관련 논문을 가진 저자 + 1-5개의 관련 논문을 가진 저자 중 무작위 50%
- **상호작용**: 저자 이름이나 녹색 원 위에 마우스를 올리면 저자 개요 차트 표시
- **지원 측면**: 페이지의 모든 저자 중에서 관련 저자를 빠르게 찾고 탐색할 수 있도록 지원

### 4. Feed-based Sorting (피드 기반 정렬)
- **시각화**: 논문 목록을 관련성 점수에 따라 정렬하여 표시
- **내용**: 개별 논문 관련성 점수를 기준으로 논문 목록 정렬
- **상호작용**: 기본적으로 관련성 순으로 정렬되며, 다른 정렬 옵션도 선택 가능
- **지원 측면**: 가장 관련성 높은 논문을 먼저 볼 수 있도록 하여 효율적인 문헌 검토 지원

## User Study Results
15명의 대학원생을 대상으로 한 사용자 연구에서 FeedLens는 Semantic Scholar와 비교하여 다음과 같은 결과를 보였다:
- 시스템 전체 참여도 4배 증가 (365.4 vs 96.5 상호작용)
- 저자 관련 기능 참여도 20배 증가 (123 vs 5.5 상호작용)
- 인지적 부담 감소 (NASA-TLX: 2.4 vs 3.3)
- 시스템 사용성 점수 향상 (SUS: 84 vs 77.3)
- 더 많은 관련 저자 발견 (관련 논문 수: 13 vs 6, 관련 논문 비율: 24.5% vs 10.5%)

## Discussion
참가자들은 FeedLens가 문헌 검토 시 더 많은 탐색 기회를 제공했기 때문에 선호했다. FeedLens는 관련 저자를 새로운 탐색적 탐색 종점으로 홍보하여 더 많은 관련 저자를 선택하도록 했다. 이 시스템은 정보의 빠른 검토를 위해 최적화되어 작업 완료에 필요한 인지적 노력이 적었다. Polymorphic lenses의 아이디어는 일반적이며 지식 그래프로 표현되고 선호 모델을 사용하는 모든 도메인에 적용될 수 있다. 예를 들어 Yelp에서는 사용자가 선호하는 요리나 취미를 기반으로 도시를 요약하고 순위를 매길 수 있으며, Netflix에서는 사용자가 좋아하는 장르별로 배우와 감독의 순위를 매길 수 있다.

## BibTeX Entry
```bibtex
@inproceedings{kaur2022feedlens,
  title={FeedLens: Polymorphic Lenses for Personalizing Exploratory Search over Knowledge Graphs},
  author={Kaur, Harmanpreet and Downey, Doug and Singh, Amanpreet and Cheng, Evie Yu-Yen and Weld, Daniel S and Bragg, Jonathan},
  booktitle={The 35th Annual ACM Symposium on User Interface Software and Technology},
  pages={1--15},
  year={2022}
}
```