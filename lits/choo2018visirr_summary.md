# VisIRR: A Visual Analytics System for Information Retrieval and Recommendation for Large-Scale Document Data

## Overview
### Problem Statement
대규모 문서 데이터에서 관련 문헌을 발견하는 것은 매우 어려운 과제이며, 특히 다학제적 연구 분야에서는 제한된 시간과 주의력으로 방대한 양의 문서를 탐색해야 한다. 기존의 키워드 기반 검색은 적절한 키워드 선택이 어렵고 높은 재현율(recall)을 달성하기 힘들다는 한계가 있다.

### Approach
VisIRR은 전통적인 질의 기반 정보 검색(passive pull)과 사용자 선호도 기반 개인화된 추천(active push)을 효과적으로 결합한 시각적 분석 시스템이다. 토픽 모델링과 차원 축소를 통해 문서를 2D 공간에 시각화하고, 사용자의 대화형 평가를 바탕으로 전체 코퍼스에서 추천 문서를 제공한다.

### Contribution
약 50만 개의 학술 문서를 효율적으로 처리하는 대규모 데이터 처리 능력, NMF 기반 토픽 모델링과 LDA 기반 차원 축소를 통한 고품질 시각화, 다중 뷰 간 일관성을 유지하는 정렬 기법, 그리고 내용/인용/공저자 네트워크 기반의 개인화된 추천 시스템을 통합적으로 제공한다.

## Introduction
문서 탐색은 복잡한 인간 활동이며, 특히 문헌 검색과 같은 탐색적 검색 작업은 기존의 정보 검색 방법으로는 충분히 지원되지 않는다. VisIRR은 시각적 분석을 통해 대규모 문서 집합에 대한 전반적인 이해를 제공하고 문서 간의 관계를 밝혀내며, 사용자의 선호도 피드백을 직접 활용하여 개인화된 추천을 제공하는 시스템이다.

## Related Work
탐색적 검색 작업을 위한 고급 접근법들이 제안되어 왔으며, IN-SPIRE는 k-means 알고리즘을 사용하여 공통 주제를 추출했고, iVisClustering은 클러스터 품질 향상을 위한 사용자 상호작용에 초점을 맞췄다. Apolo는 사용자가 지정한 초기 카테고리를 확장하는 혼합 주도 접근법을 사용했다. 그러나 VisIRR은 대규모 문서 코퍼스에 대해 개인화된 선호도 피드백을 직접 고려하는 최초의 시스템 중 하나이다.

## System Design and Visualizations

### Main Visualization Components
VisIRR의 시각화 시스템은 네 가지 주요 구성 요소로 이루어져 있다:

1. **Scatter Plot View (주요 시각화)**: 검색된 문서와 추천 문서를 2D 공간에 표시한다. 원형 노드는 검색된 문서를, 사각형 노드는 추천 문서를 나타낸다. 노드의 색상은 토픽 클러스터를, 크기는 인용 횟수를 나타낸다.

2. **Topic Cluster Summary**: 각 토픽의 대표 키워드를 표시하여 클러스터의 의미를 파악할 수 있게 한다. 사용자는 공통 키워드 대 고유 키워드의 비율을 조정하여 토픽 간 구별을 향상시킬 수 있다.

3. **Table Views**: 문서의 상세 정보를 표 형식으로 제공하며, 사용자가 평가한 문서와 추천된 문서를 별도의 표로 표시한다.

4. **Query Bar**: 키워드, 저자명, 출판 연도, 인용 횟수 등 다양한 필드를 사용한 동적 질의를 지원한다.

### Key Visualization Features

1. **Computational Zoom-in**: 사용자가 선택한 문서 부분집합에 대해 새로운 토픽 모델링과 차원 축소를 수행하여 별도의 상세 뷰를 생성한다. 이를 통해 혼잡한 영역이나 의미적으로 불분명한 클러스터를 더 명확하게 탐색할 수 있다.

2. **Multi-View Alignment**: 서로 다른 질의나 매개변수로 생성된 여러 시각화 결과 간의 일관성을 유지한다. Hungarian 알고리즘을 사용하여 토픽 클러스터 색상을 정렬하고, Procrustes 분석을 통해 공간 좌표를 정렬하여 비교를 용이하게 한다.

3. **Edge Visualization**: 평가된 문서와 추천 문서 간의 직접적인 관계(인용, 공저자 관계)를 엣지로 표시할 수 있다.

4. **Interactive Preference Feedback**: 사용자가 5점 척도로 문서를 평가할 수 있으며, 이 평가는 즉시 추천 알고리즘에 반영되어 scatter plot에 새로운 추천 문서가 표시된다.

### Supporting Literature Review Tasks

1. **Overview Generation**: 키워드 검색 결과를 토픽별로 클러스터링하고 2D 공간에 배치하여 연구 분야의 전체적인 구조를 파악할 수 있게 한다.

2. **Exploration and Drilling Down**: 특정 토픽 클러스터를 확대하거나 computational zoom-in을 통해 세부 주제를 탐색할 수 있다.

3. **Discovery Beyond Initial Query**: 사용자의 선호도 기반 추천을 통해 초기 검색 질의로는 찾을 수 없었던 관련 문서를 발견할 수 있다.

4. **Relationship Understanding**: 문서 간의 내용적 유사성, 인용 관계, 공저자 관계를 시각적으로 표현하여 연구 네트워크를 이해할 수 있게 한다.

5. **Comparative Analysis**: 정렬된 다중 뷰를 통해 시간에 따른 연구 동향 변화나 서로 다른 검색 결과를 비교할 수 있다.

## Computational Methods

시스템은 NMF(Non-negative Matrix Factorization)를 사용한 토픽 모델링, LDA(Linear Discriminant Analysis)를 사용한 감독 차원 축소, Hungarian 알고리즘과 Procrustes 분석을 사용한 뷰 정렬, 그리고 heat kernel 기반 그래프 확산 알고리즘을 사용한 추천 기능을 구현한다. 이러한 방법들은 전통적인 k-means나 PCA보다 더 나은 품질과 빠른 계산 시간을 제공한다.

## Data and Implementation

ArnetMiner 데이터셋의 약 43만 개 학술 문서를 포함하며, 효율적인 데이터 관리를 위해 원본 데이터 속성, 벡터 표현, 그래프 표현의 세 가지 형태로 데이터를 유지한다. 프론트엔드는 Java로 구현되었으며, 백엔드 계산 모듈은 MATLAB에서 Java 라이브러리로 변환되었다.

## Evaluation

사용자 연구에서 참가자들은 시각화, 평가, 추천, 상세 정보 요청 등 VisIRR의 주요 기능을 일관되게 사용했다. 특히 사용자들은 초기 검색 범위를 벗어난 추천 문서가 유용한 문서를 찾는 데 도움이 된다고 평가했으며, 키워드 기반 검색에 비해 평가 기반 정제가 더 생산적이라고 응답했다.

## Discussion

VisIRR은 대규모 문서 탐색을 위한 시각적 분석과 개인화된 추천을 효과적으로 결합한 시스템이다. 토픽 기반 클러스터링과 2D 시각화를 통해 문서 집합의 전체적인 구조를 파악할 수 있게 하고, 사용자의 선호도 피드백을 활용한 추천을 통해 초기 검색 질의를 넘어서는 탐색을 가능하게 한다. 향후 연구로는 더 빠른 대화형 토픽 모델링, 사용자 피드백을 통합한 레이아웃 알고리즘, 그리고 소셜 미디어나 뉴스 기사와 같은 다른 유형의 문서 데이터로의 확장이 제안되었다.

## BibTeX Entry
```bibtex
@article{choo2018visirr,
  title={VisIRR: A Visual Analytics System for Information Retrieval and Recommendation for Large-Scale Document Data},
  author={Choo, Jaegul and Kim, Hannah and Clarkson, Edward and Liu, Zhicheng and Lee, Changhyun and Li, Fuxin and Lee, Hanseung and Kannan, Ramakrishnan and Stolper, Charles D. and Stasko, John and Park, Haesun},
  journal={ACM Transactions on Knowledge Discovery from Data},
  volume={12},
  number={1},
  pages={8:1--8:20},
  year={2018},
  publisher={ACM}
}
```