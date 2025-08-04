# EvolutionWorks: Towards Improved Visualization of Citation Networks

## Overview
### Problem Statement
학술 문헌을 탐색하고 이해하는 것은 연구자들에게 큰 도전 과제이다. 기존의 학술 검색 도구들은 주로 텍스트 기반의 하이퍼링크 페이지로 검색 결과를 제시하여, 연구 논문들 간의 관계에 대한 정보를 충분히 전달하지 못한다. 이로 인해 연구자들은 학술 문헌의 개념적 공간을 자신의 제한된 작업 기억 내에서 구성하고 유지해야 하는 추가적인 부담을 갖게 된다.

### Approach
EvolutionWorks는 학술 논문 인용 네트워크를 애니메이션과 줌 가능한 시각화로 제시하여 연구자들이 학술 논문 간의 관계에서 나타나는 개념적 공간을 탐색할 수 있도록 지원한다. 이 시스템은 seed-grow-prune 모델을 기반으로 하여, 연구자가 아이디어의 씨앗으로 시작해 관련 논문들을 성장시키고, 최종 읽기 목록으로 가지치기하는 과정을 지원한다.

### Contribution
논문은 다섯 가지 주요 기여를 제시한다: (1) seed-grow-prune 디자인 모델, (2) kinetic layering - 추상적 문서 속성을 물리적 속성으로 인코딩하는 방법론, (3) unified presentation - 네트워크 그래프와 문서를 단일 뷰에서 보여주는 방식, (4) focus-context-focus hop - 논문 간 포커스를 전환하면서도 컨텍스트를 유지하는 네비게이션 방법, (5) cluster title summarization - 밀집된 논문 클러스터를 자동으로 요약 제목으로 표현하는 기능.

## Introduction
학술 문헌을 이해하는 것은 복잡한 하이퍼텍스트 구조로 인해 도전적이다. 대부분의 기존 검색 도구들은 텍스트 중심의 인터페이스를 제공하여 시각적 변수(크기, 색상, 값, 모양 등)를 충분히 활용하지 못한다. EvolutionWorks는 인용 네트워크를 대화형 시각화로 제시하여 연구자들이 더 많은 시각적 변수를 통해 논문 간 관계를 파악할 수 있도록 한다. 이 시스템은 특히 연구자가 익숙하지 않은 주제에 대한 읽기 목록을 구축하는 시나리오를 중심으로 설계되었다.

## Related Work
저자들은 네트워크 탐색, 특히 학술 인용 네트워크 탐색을 위한 기존 시스템들을 검토한다. Vizster는 force-directed layout을 사용한 소셜 네트워크 시각화 도구로 EvolutionWorks의 주요 영감이 되었다. CiteWiz는 growing polygon, Newton's shoulders, concept map 등 여러 시각화 기법을 제공하지만, force-directed layout을 논문이 아닌 키워드나 저자에만 적용했다. PaperCube의 CircleView는 단일 논문에 대한 focus+context를 제공하지만 인용이 많을 때 한계가 있다. CociteSeer는 공동 인용 관계를 시각화하고, XML3D 브라우저는 하이퍼볼릭 3D 그래프 뷰를 제공했다. 이러한 시스템들은 각각의 장점이 있지만, EvolutionWorks는 이들을 통합된 단일 프레젠테이션으로 결합한다.

## EvolutionWorks

### Visualization Design Features
**Kinetic Layering**: 논문에서 가장 핵심적으로 제시하는 시각화 기법은 kinetic layering이다. 이는 문서의 추상적 속성(예: 인용 수)을 물리적 속성(크기, 질량)으로 인코딩하여 force-directed 애니메이션 엔진에서 사용한다. 인용이 많은 논문은 더 크고 무거워져서 다른 논문들을 더 강하게 밀어낸다. 사용자가 작은 논문을 잡고 중요한 논문을 움직이려 하면 무거운 논문은 거의 움직이지 않아 그 중요성을 전달한다.

**Unified Presentation**: 시스템은 그래프 노드 자체를 논문 메타데이터를 담은 창으로 표현하여 모든 것을 단일 통합 뷰에 표시한다. 이는 별도의 논문 뷰어와 네트워크 뷰 사이에서 연구자의 주의가 분산되는 것을 방지한다. 시맨틱 줌을 사용하여 창 크기에 따라 표현을 단순화한다.

**Focus-Context-Focus Hop**: 논문 링크를 클릭하면 시스템은 원래 뷰에서 대상 논문으로 부드럽게 이동한다. 이때 먼저 줌아웃하여 더 많은 인용 네트워크를 보여주고, 새로운 포커스로 다시 줌인한다. 이는 논문에서 논문으로 물리적으로 뛰어다니는 것 같은 인상을 준다.

**Cluster Title Summarization**: 뷰가 줌아웃되면 논문 제목들이 겹쳐 읽기 어려워진다. 시스템은 자동으로 가까운 논문들을 클러스터로 묶고, 클러스터 멤버들의 메타데이터에서 공통 용어를 추출하여 요약 제목을 생성한다. Porter stemming 알고리즘과 tf-idf 점수를 사용하여 상위 6개 용어를 선택한다.

### Seed-Grow-Prune Model
시스템은 연구자들이 문헌 검색을 수행하는 방식을 반영한 seed-grow-prune 모델을 구현한다:
- **Seeding**: 검색 결과나 URL을 통해 초기 논문들을 작업공간에 추가
- **Growth**: 기존 논문의 참고문헌이나 인용을 선택하면 새 논문이 "싹트듯이" 나타남
- **Pruning**: 개별 창을 닫거나 전체 브랜치를 제거하여 읽기 목록을 정제

## Discussion
사용자 연구 결과, EvolutionWorks를 사용한 그룹이 일반 웹 브라우저를 사용한 그룹보다 더 높은 인용 수를 가진 논문들을 선택했다. 이는 kinetic layering이 중요한 논문에 사용자의 주의를 효과적으로 이끌었음을 시사한다. 작업 시간에는 유의미한 차이가 없었는데, 이는 사용자들이 지루해질 때까지 작업하는 경향이 있으며, 개선된 결과는 더 효율적인 탐색 때문임을 나타낸다.

## BibTeX Entry
```bibtex
@inproceedings{wilkins2015evolutionworks,
  title={EvolutionWorks: Towards Improved Visualization of Citation Networks},
  author={Wilkins, Jason and J{\"a}rvi, Jaakko and Jain, Ajit and Kejriwal, Gaurav and Kerne, Andruid and Gumudavelly, Vijay},
  booktitle={15th Human-Computer Interaction (INTERACT)},
  pages={213--230},
  year={2015},
  month={Sep},
  address={Bamberg, Germany},
  doi={10.1007/978-3-319-22723-8_17}
}
```