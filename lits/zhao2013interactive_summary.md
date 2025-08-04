# Interactive Exploration of Implicit and Explicit Relations in Faceted Datasets

## Overview

### Problem Statement
학술 문헌 컬렉션과 같은 많은 데이터셋들은 다양한 이질적인 facet들을 포함하며, 이들로부터 암묵적 관계들이 도출될 뿐만 아니라 데이터 항목 간의 명시적인 참조 관계도 존재한다. 이러한 데이터의 탐색은 대규모 데이터 스케일뿐만 아니라 리소스 구조와 의미의 복잡성 때문에 어려움이 있다. 기존 시스템들은 주로 faceted classification이나 multivariate network visualization 중 하나에만 초점을 맞추어, 두 가지 관계 유형을 모두 적절히 다루지 못했다.

### Approach
PivotSlice라는 대화형 시각화 기법을 제시하여 효율적인 faceted browsing과 함께 데이터 관계를 발견하는 유연한 기능을 제공한다. 직접 조작 메타포를 통해 사용자가 multi-focus와 multi-scale의 표 형태 뷰를 기반으로 전체 데이터셋을 여러 의미 있는 부분으로 세분화하면서 데이터에 대한 일련의 동적 쿼리를 시각적이고 논리적으로 구성할 수 있도록 한다.

### Contribution
동적 쿼리 테이블을 통한 multi-focus 및 multi-scale 탐색 방식을 제시하고, 명시적 참조 관계와 암묵적 상관관계를 모두 시각화하는 통합된 접근법을 제공한다. 라이브 검색과 온라인 데이터 통합, 그래픽 상호작용 히스토리, 부드럽게 애니메이션된 시각적 상태 전환 등의 기능을 통해 시각적 탐색과 의미 형성 과정을 촉진한다.

## Introduction
많은 응용 분야에서 탐색하고 분석하려는 데이터셋은 크기가 커질 뿐만 아니라 구조가 더 풍부해지고 의미론적으로 더 복잡해지고 있다. 데이터셋은 엔티티 간의 명시적 관계(예: 소셜 네트워크의 행위자 간 우정, 운송 네트워크의 도시 간 철도)와 속성으로부터 도출될 수 있는 암묵적 관계(예: 같은 언어와 직업을 공유하는 소셜 네트워크의 행위자들)를 모두 가질 수 있다. 학술 출판물 데이터를 예로 들면, 참조와 인용이 논문 간의 명시적 관계를 구성하고, "같은 저자를 공유하고 2000년 이전에 출판됨", "같은 키워드를 포함하고 몇 년 후 인지과학에서 널리 참조됨" 등의 특정 속성에 대한 쿼리로 암묵적 관계를 형성할 수 있다.

## Related Work
### Faceted Exploration
초기 시스템들인 FOCUS와 InfoZoom은 사용자가 수직 facet 축의 속성을 피벗, 확장, 축소할 수 있는 대형 테이블에 필터링된 데이터 객체를 배열하여 동적 쿼리를 수행할 수 있게 했다. 그러나 이러한 기법들은 탐색 과정이 선형적이라고 가정하여, 사용자가 단계별로 쿼리 사양을 늘려가며 데이터를 드릴다운해야 했고, 이는 다른 쿼리 결과를 비교함으로써 가능했을 우연한 발견을 제한할 수 있었다. Polaris(후에 Tableau가 됨)는 관계형 데이터베이스의 표 형태 표현을 제공했지만 각 facet의 속성 수가 제한적이었다. PaperLens, NetLens, FacetLens는 대규모 학술 저장소의 트렌드와 연결을 탐색하는 것을 지원했지만, 전체 데이터나 다른 부분집합에 걸친 참조 구조의 토폴로지를 적절히 시각화하지 못했다.

### Multivariate Network Visualization
네트워크 시각화 기법들은 데이터 항목 간의 참조(명시적) 관계를 탐색하는 데 초점을 맞추었다. Citeology는 연대순 레이아웃으로 조직된 논문 제목들을 연결하여 인용 패턴의 계보를 드러냈다. PivotPath는 여러 효율적인 faceted 탐색 메커니즘을 제공했지만, multi-focus 방식으로 다른 쿼리 결과를 비교하는 능력을 하나 또는 두 개의 속성 값으로 제한했고, 다른 데이터 속성 간의 전반적인 관계나 트렌드를 강조하지 않았다. GraphDice와 같은 기법들은 모든 잠재적 암묵적 관계의 명확한 개요를 제공했지만, 많은 수의 속성이 있으면 매트릭스 뷰가 너무 작고 복잡해져 상호작용하기 어려웠다.

## Interactive Exploration of Implicit and Explicit Relations in Faceted Datasets
PivotSlice의 주요 사용자 인터페이스는 다섯 개의 상호작용적으로 조정된 뷰로 구성된다: (a) 메타데이터 검색 능력과 데이터 관리 및 뷰 구성의 필수 기능을 제공하는 Search and Operation Panel, (b) 최근 시각화 상태를 보여주어 사용자가 작업을 실행 취소하거나 다시 실행할 수 있게 하는 History Panel, (c) 사용자가 현재 상호작용하는 시각화 객체의 상세 속성을 제시하는 Information Panel, (d) 사용자 상호작용에 기반한 데이터셋의 동적 시각적 표현을 표시하는 Main Canvas, (e) Main Canvas의 다른 데이터 부분집합 간의 전반적인 관계를 요약하는 Cell Relation Panel이다.

### Visual Query Language
Main Canvas는 사용자가 동적 시각적 쿼리를 수행하여 데이터를 탐색할 수 있는 주요 인터페이스 구성요소다. PivotSlice는 논리적으로 Query Table 뷰에서 사용자 정의 쿼리 세트를 조직하며, 이는 Query Cell들의 매트릭스로 구성된다. Query Table 레이아웃은 수평 및 수직 Query Axes의 두 Data Filter 그룹에 따라 구축된다. 각 Facet Panel은 선택된 속성 값에 대한 논리적 OR 연산에 해당하고, 각 Data Filter는 Facet Panel들의 기본 쿼리에 대한 논리적 AND 연산에 해당하며, 각 Query Cell은 해당 Data Filter들의 두 결과 쿼리에 대한 논리적 AND 연산으로 복합 쿼리를 구성한다.

## Design Rationales
### Multi-Focus and Multi-Scale Exploration
PivotSlice는 사용자가 표 형태의 동적 쿼리를 통해 데이터셋을 의미 있는 부분집합으로 체계적으로 나눌 수 있도록 하여 faceted 데이터셋의 multi-focus 탐색을 지원한다. 이를 통해 열이나 행을 따라 Query Cell을 보면서 사용자 정의 의미론에 걸친 데이터셋의 다른 부분을 편리하게 비교할 수 있다. 다양한 스케일로 데이터 부분집합을 보기 위해, 사용자는 표 뷰의 행이나 열을 최소화하여 해당 셀의 노드를 집계할 수 있다.

### Information Seeking with Direct Manipulation
PivotSlice의 설계는 잘 알려진 visual information seeking mantra를 포함한 많은 기초 연구에서 제안된 효율적인 시각화 시스템 생성 원칙을 따른다. 특히 Shneiderman의 일곱 가지 일반적인 추상 작업을 faceted 데이터 탐색에서 반복적인 지식 발견 과정을 지원하는 필수 요소로 확장한다: Overview First, Pivot and Slice, Relate and Extract, Details-on-Demand, History Available.

### Key Visualization Features
**Within-Cell Relationships**: 특정 Query Cell의 데이터 부분집합에 대해, PivotSlice는 데이터 항목의 유연한 레이아웃을 허용하여 다른 속성 간의 트렌드와 관계 발견을 지원한다. 기본 뷰는 force-directed 레이아웃으로 생성되며, 사용자가 하나의 축에만 layout-aligning facet을 설정하면 노드가 행이나 열로 분할되고, 양쪽 축에 모두 지정하면 regular scatter-plot이 된다.

**Between-Cell Relationships**: Cell Relation Panel은 선택된 테이블 셀과 다른 모든 셀 간의 상호 연결 측정값을 네 가지 다른 메트릭(전체 교차 엣지, 들어오는 엣지, 나가는 엣지, 중복 노드의 수)으로 색상 매핑하여 표시한다. 셀이 선택되고 다른 셀 위에 마우스를 올리면, 이 셀들 간의 링크만 녹색(나가는)과 주황색(들어오는)으로 강조 표시된다.

## Evaluation
대학 연구자 6명과 함께 정성적 실험실 연구를 수행했다. 참가자들은 low-level 작업(T1-T20)을 비교적 빠르게 완료할 수 있었으며, 평균 시간은 작업당 약 1.5분이었다. High-level 탐색 작업(T21-T23)의 경우, 참가자들은 더 깊이 탐색하고 다양한 기능을 사용하여 통찰력을 찾는 데 각 참가자당 총 10-15분을 소요했다. 

참가자들은 PivotSlice가 faceted 데이터 탐색과 관계 발견을 위한 유연하고 효율적이며 적절한 분석 기능을 갖추고 있다는 데 동의했다. 한 참가자는 "복잡한 필터와 검색을 조직하기 쉽게 만든다"고 언급했고, 다른 참가자는 "데이터 속성 간의 트렌드와 분포를 발견하는 데 매우 도움이 된다... 연결과 다양한 정렬을 사용하여 데이터의 다른 부분을 관련시키기 쉽다"고 말했다.

## Discussion
PivotSlice의 핵심 인터페이스 구성요소는 Main Canvas로, 사용자가 테이블로 조직된 동적 쿼리를 구성하여 전체 데이터셋을 세분화하는 맞춤형 의미론을 구축할 수 있다. 이 시각화는 명시적 데이터 관계(토폴로지)의 효율적인 multi-focus 및 multi-scale 브라우징뿐만 아니라 암묵적 트렌드를 드러내기 위해 facet에 기반한 데이터 항목의 유연한 상관 방식을 제공한다. PivotSlice는 범주형 및 수치형 속성을 모두 가진 faceted 데이터셋에 대해 이러한 종류의 탐색을 지원하며, 이는 더 일반적인 데이터 형식을 포함하도록 확장될 수 있다.

## BibTeX Entry
```bibtex
@article{zhao2013interactive,
  title={Interactive exploration of implicit and explicit relations in faceted datasets},
  author={Zhao, Jian and Collins, Christopher and Chevalier, Fanny and Balakrishnan, Ravin},
  journal={IEEE Transactions on Visualization and Computer Graphics},
  volume={19},
  number={12},
  pages={2080--2089},
  year={2013},
  publisher={IEEE}
}
```