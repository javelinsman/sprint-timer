# BiblioViz: A System for Visualizing Bibliography Information

## Overview

### Problem Statement
학술 분야에서 논문, 저자, 연구 영역, 출판 장소 간의 복잡한 상호 관계를 이해하는 것은 매우 중요하지만, 기존의 텍스트 기반 검색과 브라우징만으로는 이러한 관계를 파악하기 어렵다. InfoVis 2004 콘테스트에서 여러 서지 정보 시각화 시스템이 개발되었으나, 각 시스템은 일부 독특한 뷰만을 제공하고 있어 모든 원하는 기능을 제공하는 단일 최적 시스템이 없는 상황이다.

### Approach
기존 시스템들의 바람직한 기능들을 응집력 있는 디자인으로 통합하는 접근법을 채택했다. 최소한의 시각화 구성 요소를 사용하여 최대한의 데이터 뷰를 제공하는 것을 목표로 하며, 기존 시스템들을 체계적으로 분석하여 Table View와 Network View라는 두 가지 핵심 뷰로 압축했다. 이를 통해 사용자가 다양한 시각적 메타포에 의해 혼란스러워하는 것을 방지하면서도 포괄적인 기능을 제공한다.

### Contribution
BiblioViz는 서지 정보 시각화를 위한 컴팩트하고 포괄적이며 확장 가능한 시스템을 제시한다. 기존의 다양한 시각화 기법들을 단 두 개의 뷰(Table View와 Network View)로 효과적으로 통합했으며, 이 두 뷰를 연결하여 상호작용이 가능하도록 했다. 또한 3D Network View에서의 아치형 링크, Network View에서의 분할된 노드, SOM 밀도 맵의 네트워크 디스플레이 중첩 등 새로운 시각적 표현 방법들을 도입했다.

## Introduction
학술 세계에서 각 분야의 인용 데이터베이스는 연구자들에게 매우 귀중한 자원이다. 텍스트 기반 검색과 브라우징이 데이터베이스의 정보를 찾는 데 광범위하게 사용되지만, 논문, 저자, 연구 영역, 출판 장소 간의 복잡한 상호 관계는 시각적 수단으로 가장 잘 드러난다. InfoVis 2004 콘테스트는 정보 시각화 분야의 서지 정보를 시각화하는 데 전념했으며, 많은 관심을 끌어 다수의 제출물을 받았다. 콘테스트 주최측은 4개의 1등 작품과 8개의 2등 작품을 선정했는데, 이들은 각각 다른 시각화 표현과 시스템을 제시했으며 다양한 트레이드오프, 강점과 약점을 가지고 있었다. 본 연구는 이러한 기존 시스템들의 장점을 통합하여 사용 가능하고 포괄적인 서지 정보 시각화 시스템인 BiblioViz를 설계하고 구축하는 것을 목표로 한다.

## Related Work
저자들은 InfoVis 2004 콘테스트 출품작들과 기존 서지 정보 시각화 도구들을 체계적으로 분석했다. Chen과 Carr의 작업과 Noel의 작업이 여러 콘테스트 출품작에 큰 영향을 미쳤음을 언급하며, 기존 시각화 시스템들을 네 가지 광범위한 카테고리로 분류했다: Table (PaperLens, Keyword Burst Table, Time Slicer 등), Network (2D와 3D로 세분화되며 Citation Network, WilmaScope, Tulip 등 포함), Node placement without network (IN-SPIRE, MonkEllipse 등), 그리고 Others (InterRing 기법 등). 각 카테고리 내에서도 다양한 변형이 존재하는데, 예를 들어 Table 카테고리에서는 모든 시스템이 시간을 한 축에 할당하며 대부분 x축을 사용한다는 공통점을 발견했다. Network 카테고리에서는 색상과 크기를 사용하여 인용 수나 출판 연도 등의 추가 정보를 표현하는 다양한 방법들이 사용되었다. 저자들은 이러한 분석을 통해 Table View와 Network View 두 가지만으로도 기존 시각 표현들의 기능을 충분히 다룰 수 있다는 결론을 도출했다.

## BiblioViz
BiblioViz는 다섯 부분으로 구성된다: (1) Table View, (2) Network View, (3) Paper Details Panel, (4) Data Menu, (5) User Control Panel. Table View에서는 2D 테이블이 표시되며, x축은 출판 연도를 나타내고 y축은 사용자가 출판 장소, 저자, 또는 연구 영역 중에서 선택할 수 있다. 각 논문은 사각형으로 표현되며 x축과 y축의 속성 값에 따라 테이블의 셀에 배치된다. 사각형의 높이는 상대적 중요도(다른 논문에 의해 인용된 횟수)를 나타낸다. Datelens와 유사한 focus+context 방법을 사용하여 테이블 네비게이션을 제공하며, 사용자는 개별 행이나 열을 선택하여 포커스를 맞출 수 있다. Network View는 Filter, Node Placement, Highlight, Rendering, Auxiliary Graphics의 다섯 가지 구성 요소로 이루어져 있다. 사용자는 저자, 논문, 출판 장소 또는 연구 영역을 나타내는 노드로 구성된 네트워크를 그리도록 선택할 수 있으며, SOM(자기조직화맵), force-directed, centroid 등 여러 레이아웃 알고리즘을 지원한다. 2D와 3D 뷰를 제공하며, 3D 뷰에서는 직선 대신 튜브 아치를 사용하여 링크를 그려 링크의 끝점을 더 잘 인식할 수 있도록 했다.

## Evaluation
저자들은 InfoVis 2004 콘테스트에서 제시된 세 가지 주요 과제를 통해 BiblioViz의 효과성을 평가했다. 첫째, "연구 영역과 그 진화를 특성화하라"는 과제에 대해 Network View는 SOM을 사용하여 연구 영역 간의 관계를 잘 보여주고, Table View는 x축에 시간을 할당하여 연구 영역의 진화를 표시할 수 있음을 보였다. 둘째, "특정 저자가 연구 영역 내에서 어디에 위치하는가"라는 질문에 대해서는 Network View에서 논문을 나타내는 하단 평면과 저자를 나타내는 상단 평면을 사용하여 효과적으로 답할 수 있었다. 셋째, "두 명 이상의 저자 간의 관계는 무엇인가"라는 과제에 대해서는 force-directed 레이아웃으로 배치된 저자 노드를 포함하는 평면을 사용하여 협업 관계를 시각화할 수 있었다.

## A Case Study
Ben Shneiderman에 대한 탐색을 중심으로 한 사용 사례를 제시했다. 사용자는 먼저 Table View에서 전체 데이터셋의 개요를 보고, 슬라이더를 사용하여 지난 20년간 가장 많이 인용된 상위 10명의 저자의 논문만 표시하도록 필터링했다. Stuart Card가 이 기간 동안 가장 많이 인용된 저자로 나타났고, 그 다음이 Jock Mackinlay와 Ben Shneiderman이었다. Shneiderman의 1991년 논문 "Treemaps: A Space-Filling Approach to the Visualization of Hierarchical Information Structures"를 클릭하여 상세 정보를 확인하고, 이 논문이 테이블의 거의 모든 다른 저자들에 의해 인용되거나 인용하고 있음을 확인했다. 이후 Network View로 전환하여 force-directed 그래프 레이아웃 알고리즘을 사용한 저자 네트워크를 보고, 3D로 논문 노드를 포함하는 또 다른 평면을 추가하여 Shneiderman의 주요 연구 영역이 사용자 인터페이스, 정보 검색, 계층 구조임을 확인했다.

## Future Work
BiblioViz는 확장 가능하도록 설계되었으며, 향후 확장 가능성으로는 더 많은 데이터(논문의 전체 텍스트와 그림/캡션 등), 새로운 시각적 표현, 추가적인 알고리즘(Pajek, Galaxies, BiblioMapper 등)을 포함시키는 것이 있다. 현재 작업한 데이터는 다른 잠재적 서지 데이터셋에 비해 작은 편이므로, 시스템의 견고성을 완전히 테스트하기 위해서는 수천 개의 참조를 포함하는 더 큰 데이터셋이 필요하다. Table View에서는 확대/축소 가능한 인터페이스를 통해 확장성 문제를 해결했지만, Network View에서는 노드 수가 증가함에 따라 혼잡도가 증가하는 문제를 해결할 더 나은 방법이 필요하다.

## Conclusions
저자들은 서지 정보를 시각화하기 위한 컴팩트하고 포괄적이며 확장 가능한 시스템을 소개했다. 설계는 정의된 목표 집합에 의해 주도되었으며, 최소한의 시각적 표현 원칙과 현재 시각화 기법에 대한 분석을 기반으로 했다. 수많은 기존 시각적 표현을 Table View와 Network View 두 가지로 압축하고, 이들을 함께 연결하며, 요청 시 세부 정보를 제공했다. 이 두 뷰가 서지 데이터에 포함된 많은 관계를 효과적으로 표현할 수 있음을 발견했다. 사용자가 너무 많은 다른 시각적 메타포에 의해 혼란스러워지는 것을 방지하기 위해 다른 뷰의 수를 제한했으며, Table과 Network View는 사용자에게 친숙한 일반적으로 사용되는 시각적 메타포이기 때문에 선택했다. 각 View 내에서 사용자가 동일한 뷰 패러다임을 유지하면서 서지 데이터 스키마의 다른 부분을 탐색하기 위해 맞춤형 시각화를 만들 수 있도록 더 넓은 범위의 옵션과 보조 그래픽을 제공했다.

## BibTeX Entry
```bibtex
@inproceedings{shen2006biblioviz,
  title={BiblioViz: a system for visualizing bibliography information},
  author={Shen, Zeqian and Ogawa, Michael and Teoh, Soon Tee and Ma, Kwan-Liu},
  booktitle={Proceedings of the 2006 Asia-Pacific Symposium on Information Visualisation-Volume 60},
  pages={93--102},
  year={2006},
  organization={Citeseer}
}
```