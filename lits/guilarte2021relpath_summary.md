# RelPath: an interactive tool to visualize branches of studies and quantify the expertise of authors by citation paths
## Overview
### Problem Statement
문헌 리뷰 과정에서 특정 연구 주제에 대한 중요한 참고문헌을 찾고, 해당 분야의 전문가 저자를 식별하는 것은 어려운 작업이다. 기존 접근법들은 주로 텍스트 유사도나 전체 출판물 수에 의존하며, 인용 네트워크의 토폴로지와 문헌 간의 영향력 있는 연결을 충분히 고려하지 못한다.

### Approach
RelPath는 인용 네트워크를 시각화하고 인용 경로를 통해 저자의 전문성을 정량화하는 대화형 시각화 도구이다. 이 시스템은 Max-Generator Graph (MG)라는 새로운 그래프 구조를 도입하여 가장 영향력 있는 참고문헌만을 포함하는 단순화된 네트워크를 생성하고, 협업적 및 자동적 방법으로 참고문헌의 순위를 매긴다.

### Contribution
이 연구의 주요 기여는 세 가지이다: (1) 인용 경로를 통한 저자 전문성 계산을 위한 새로운 함수 제안, (2) 과학 출판물 간의 가장 중요한 관계를 시각화하는 대화형 지원 도구 개발, (3) 참고문헌 순위 매기기를 위한 협업적 방법 제안.

## Introduction
과학 출판물 네트워크는 특정 연구 주제에 대한 관련 논문을 찾고 다양한 연구 분야의 전문 저자를 식별하는 데 중요한 역할을 한다. 특히 학술지 편집자나 학회 프로그램 위원회가 논문 심사자를 선정할 때 잠재적 전문가를 찾는 것은 중요한 과제이다. RelPath는 선택된 논문에 대한 관련 논문과 저자를 찾는 작업을 돕기 위해 개발된 시스템이다.

## Related Work
관련 연구는 크게 두 분야로 나뉜다. 첫째, 전문가 찾기 시스템은 주로 저자의 출판물과 인용 수를 기반으로 전문성을 측정한다. 그러나 대부분의 기존 접근법은 전체 문서 집합의 유사도 계산에 의존하여 계산량이 많다는 문제가 있다. 둘째, 과학 문서 시각화 연구에서는 CiteRivers, PaperVis, SurViss 등 다양한 시스템이 개발되었지만, 특정 문서의 인용 링크를 관련성에 따라 필터링하고 영향력 있는 인용 경로를 찾는 대화형 시각화 시스템은 아직 없었다.

## Terminology and overview of the proposed approach
RelPath는 그래프 기반 모델을 따른다. Citation Graph는 논문을 노드로, 인용 관계를 엣지로 표현하는 방향성 비순환 그래프이다. Max-Generator Graph (MG)는 각 논문에서 가장 중요한 참고문헌만을 선택하여 만든 Citation Graph의 부분 그래프이다. Relevant References Path (RRP)는 MG 그래프에서 두 노드 간의 경로로, 연구 주제의 진화를 나타낸다. 저자의 전문성은 타겟 논문과 저자의 출판물 간의 RRP를 기반으로 계산되며, 경로의 거리와 가중치를 고려한다.

## RelPath system
RelPath 시스템은 두 가지 주요 시각화를 제공한다. 첫 번째는 전체 인용 네트워크로, 노드는 논문을 나타내고 나가는 엣지는 참고문헌을, 들어오는 엣지는 인용을 나타낸다. 가장 중요한 참고문헌 엣지는 주황색으로 강조된다. 두 번째 네트워크는 선택된 노드의 참고문헌만을 보여주며, 출판 연도에 따라 레벨로 구성된다. 사용자는 DOI, 저자 이름, 또는 제목으로 문서를 검색할 수 있고, 시각적으로 가장 많이 인용된 노드를 탐색할 수 있다. 저자 순위 도구는 선택된 논문에 대한 잠재적 심사자를 찾기 위해 관련 저자들의 순위를 테이블 형식으로 제공한다.

## Demonstration of the use
시스템 사용 예시로 "marching cubes" 주제의 189개 논문과 2,334개 인용 관계로 구성된 데이터셋을 구축했다. RelPath를 통해 연구 분야의 진화를 시각화할 수 있으며, 예를 들어 "Ambiguities and Holes"와 "Cracks and Simplification" 같은 연구 분기를 식별할 수 있다. 시스템은 인용 경로를 통해 저자의 관련성을 계산하여 특정 논문의 잠재적 심사자를 추천한다. 협업적 방법을 통해 사용자들은 참고문헌의 중요도에 투표할 수 있으며, 이는 자동 방법과 다른 순위를 생성할 수 있다.

## Discussion and limitations
RelPath의 강점은 영향력 있는 인용을 고려하여 핵심 논문과 관련 저자를 찾는다는 점이다. 그러나 몇 가지 제한사항이 있다: 저자가 여러 연구 분야에서 활동하는 경우 분야별 전문성이 다를 수 있고, 공동 저자의 기여도를 구분하지 못하며, 협업적 방법이 효과적이려면 많은 전문가의 참여가 필요하다. 또한 저자 이름 모호성 문제를 해결하기 위해 각 저자에게 고유 ID를 부여하고 이름 변형을 관리했다.

## BibTeX Entry
```bibtex
@article{guilarte2021relpath,
  title={RelPath: an interactive tool to visualize branches of studies and quantify the expertise of authors by citation paths},
  author={Guilarte, Orlando Fonseca and Barbosa, Simone Diniz Junqueira and Pesco, Sinesio},
  journal={Scientometrics},
  volume={126},
  number={6},
  pages={4871--4896},
  year={2021},
  publisher={Springer}
}
```