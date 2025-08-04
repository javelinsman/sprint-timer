# PaperPoles: Facilitating Adaptive Visual Exploration of Scientific Publications by Citation Links

## Overview
### Problem Statement
학술 연구자들이 citation chaining을 통해 관련 논문들을 탐색하는 것은 일반적인 정보 추구 행동이지만, 기존의 학술 검색 시스템들은 키워드 쿼리 기반의 리스트 형태 인터페이스에 의존하고 있어 복잡하고 진화하는 정보 요구를 지원하는데 한계가 있다. 특히 인용 관계를 활용한 탐색적 검색을 효과적으로 지원하지 못하고 있다.

### Approach
연구자들이 seed 논문들로부터 시작하여 citation links를 통해 관련 논문들을 탐색할 수 있도록 지원하는 인터랙티브 시각화 시스템을 개발했다. 시스템은 positive/negative 쿼리를 직관적으로 표현할 수 있게 하고, 검색 결과를 클러스터로 그룹화하여 시각화하며, 관련성 패턴을 보여준다.

### Contribution
복잡한 positive/negative 쿼리를 끊김없이 생성하고 정제할 수 있는 시각적 분석 시스템을 제안했으며, 검색 결과의 측면 개요와 관련성 패턴을 모두 보여주는 시각화를 구현했다. 사용자 실험을 통해 특히 복잡한 검색 작업에서 시스템의 효과성을 입증했다.

## Introduction
학술 논문 검색은 연구 과정의 필수적인 첫 단계이며, citation chaining은 연구자들이 인용 관계를 따라가며 관련 논문을 찾는 일반적인 방법이다. 이러한 chaining 활동은 우연한 정보 발견과 연구 창의성을 자극할 수 있지만, 기존의 키워드 쿼리 기반 시스템과 리스트 기반 인터페이스로는 이를 효과적으로 지원하기 어렵다. 연구자들은 인용을 탐색할 때 복잡하고 불확실하며 진화하는 정보 요구를 가지며, 이는 키워드 쿼리 작성을 어렵게 만든다.

## Related Work
저자들은 관련 연구를 세 가지 주요 영역으로 구성했다. 첫째, 탐색적 검색과 학술 검색 분야에서는 berrypicking 모델과 Ellis의 정보 추구 행동 모델을 기반으로 chaining이 학술 정보 추구에서 중요한 역할을 한다는 점을 강조했다. 둘째, 문헌 컬렉션 시각화 분야에서는 CiteSpace, VOSviewer 등의 도구들이 과학적 구조와 진화를 보여주지만 주로 분석 목적이며 검색 작업을 직접 지원하지는 않는다고 지적했다. 셋째, 검색 결과 시각화 분야를 리스트 기반과 비리스트 기반으로 나누어 분석하며, 현재 방법들이 주로 키워드나 토픽 같은 텍스트 기반 관심점에 초점을 맞추고 있어 문서 간 링크를 충분히 활용하지 못한다고 비판했다.

## System Design

### Visualizations Designed
1. **Cluster View (메인 시각화)**:
   - 논문들을 bibliographic coupling network 기반으로 클러스터링하여 표시
   - 각 클러스터는 토픽을 나타내며, 클러스터 내 노드들은 Force-Directed Layout으로 배치
   - 노드의 수평 위치는 positive/negative 쿼리에 대한 combined relevance score를 나타냄 (왼쪽이 더 관련성 높음)
   - 노드 크기는 인용 수를 나타냄
   - 각 클러스터는 TF-IDF 기반으로 추출된 3개의 레이블로 요약됨
   - 본 적 있는 노드는 채도가 낮아져 구별됨

2. **Query Drop Boxes**:
   - Positive query drop box (왼쪽)와 Negative query drop box (오른쪽)
   - 드래그 앤 드롭으로 논문을 추가할 수 있음
   - 각 쿼리의 가중치를 슬라이더로 조절 가능

3. **List View**:
   - 선택된 논문들 또는 전체 논문의 상세 정보 표시
   - 관련성 점수, 인용 수, 출판 연도로 정렬 가능
   - 논문을 북마크, 삭제, positive/negative 쿼리로 추가 가능

### System Features Supporting Literature Review
1. **Adaptive Query Refinement**:
   - Seed article 추가/제거
   - Negative query 추가로 원하지 않는 논문 필터링
   - 쿼리 가중치 조절로 선호도 표현

2. **Interactive Exploration**:
   - 클러스터 뷰에서 사각형 그리기로 관심 부분집합 선택
   - 관련 없는 논문/클러스터 삭제 (세션 동안 유지)
   - References와 citations 선택적 로드

3. **Context-Aware Visualization**:
   - 클러스터 매칭 알고리즘으로 쿼리 변경 시 시각적 일관성 유지
   - 관련성 계산은 bibliographic coupling (Jaccard Index) 기반
   - SUM norm과 CombMNZ 방법으로 다중 쿼리 점수 결합

## Experiment
28명의 도서관정보학 분야 연구자들을 대상으로 2x2 between-subjects 실험을 수행했다. 두 가지 난이도의 작업(T1: factors affecting citations, T2: science mapping visualization tools)을 베이스라인 시스템과 PaperPoles에서 수행하도록 했다.

## Results
PaperPoles는 단순한 작업(T1)과 복잡한 작업(T2) 모두에서 정확도를 유의미하게 향상시켰다(T1: 0.80→0.91, T2: 0.28→0.41). 작업 완료 시간은 복잡한 작업에서만 유의미하게 감소했다(17.5분→12.4분). 탐색 효과성(관련 논문 발견을 위해 탐색한 논문 수)도 복잡한 작업에서만 향상되었다. 사용자들은 PaperPoles에서 더 많은 seed article을 추가하고 다양한 상호작용 기능을 활용했으며, 특히 복잡한 작업에서 이러한 경향이 두드러졌다.

## Discussion
시스템의 클러스터 뷰는 검색 결과의 측면 개요와 관련성 패턴을 보여줌으로써 연구자들이 정보 요구에 맞는 부분집합을 식별하는데 도움을 준다. 연구자들이 직관적이고 반복적으로 정보 요구를 표현할 수 있게 함으로써 복잡한 검색 작업의 성능을 향상시킬 수 있다. 작업의 복잡도가 탐색적 검색 과정에서 중요한 역할을 하며, 시각화 인터페이스의 이점은 작업 복잡도에 따라 달라진다는 것을 발견했다.

## BibTeX Entry
```bibtex
@article{he2019paperpoles,
  title={PaperPoles: Facilitating Adaptive Visual Exploration of Scientific Publications by Citation Links},
  author={He, Jiangen and Ping, Qing and Lou, Wen and Chen, Chaomei},
  journal={Journal of the Association for Information Science and Technology},
  volume={70},
  number={8},
  pages={843--857},
  year={2019},
  publisher={Wiley Online Library}
}
```