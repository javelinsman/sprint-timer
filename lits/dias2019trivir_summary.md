# TRIVIR: A Visualization System to Support Document Retrieval with High Recall

## Overview

### Problem Statement
정보 검색 작업에서 높은 재현율(recall)을 달성하기 위한 문서 검색은 사용자가 정보 요구를 명확한 쿼리로 표현하기 어려운 상황에서 특히 중요하다. 기존의 순위 목록 방식은 탐색적 검색이나 문헌 조사와 같은 작업에서 관련 문서를 놓칠 가능성이 있으며, 어휘 불일치(vocabulary mismatch) 문제로 인해 같은 개념을 다른 용어로 표현하거나 하나의 용어가 다른 의미로 사용되는 경우를 처리하지 못한다.

### Approach
TRIVIR는 Continuous Active Learning (CAL) 프로토콜을 구현한 정보 검색 엔진과 인터랙티브 시각화를 통합한 시스템이다. 사용자가 문서를 관련/비관련으로 레이블링하면 머신러닝 알고리즘이 학습하여 잠재적으로 관련된 문서를 추천하고, 다양한 시각화 뷰를 통해 문서 컬렉션을 탐색할 수 있도록 지원한다. 특히 용어의 동의어 제공과 용어가 사용되는 맥락을 보여주는 뷰를 통해 어휘 불일치 문제를 해결한다.

### Contribution  
기존 정보 검색 시각화 시스템 대비 두 가지 주요 장점을 제공한다: 첫째, 머신러닝 알고리즘의 출력을 시각화에 통합하면서 알고리즘의 수렴을 향상시키고 가속화하는 다양한 사용자 인터랙션을 지원한다. 둘째, 용어의 동의어 제공과 용어가 컬렉션 내에서 어떻게 사용되는지 보여주는 뷰를 통해 어휘 불일치 문제를 해결한다.

## Introduction
사용자가 특정 주제와 관련된 문서를 찾고자 하지만 정보 요구를 명확하고 객관적인 쿼리로 표현할 수 없는 상황이 자주 발생한다. 전형적인 예로 특정 주제에 대한 문헌 조사가 있으며, 초기 키워드 기반 검색이 많은 문서를 반환하더라도 실제로 관련된 문서를 식별하는 데는 상당한 사용자 노력이 필요하다. 높은 재현율을 추구하면 정밀도가 떨어지는 문제가 발생하여 사용자가 많은 비관련 문서를 검토해야 하는 중요한 이슈가 있다.

## Related Work
탐색적 정보 검색을 위한 시각화 시스템은 두 가지 범주로 나뉜다. 첫째, 문서와 쿼리의 관계를 시각적으로 표현하여 검색 과정을 투명하게 만드는 시스템들이 있다. VIBE와 TileBars 같은 초기 시스템은 문서가 특정 키워드를 포함하는지에 따라 관련성을 평가했다. 이후 시스템들은 벡터 공간 모델을 사용하여 문서와 쿼리를 다차원 벡터로 표현하고, 클러스터링이나 메타데이터를 활용하여 탐색을 지원했다. 둘째, Active Learning 프로토콜을 활용한 시스템들이 있다. 특히 e-discovery 분야에서 Technology-Assisted Review (TAR)가 도입되어 머신러닝 알고리즘이 초기 훈련 세트를 기반으로 관련 문서를 예측한다. Continuous Active Learning (CAL) 프로토콜은 사용자 피드백을 통해 반복적으로 관련 문서에 대한 이해를 개선한다.

## TRIVIR

### System Architecture
TRIVIR는 여섯 개의 뷰로 구성된다:
1. **Terms View**: 쿼리 문서의 중요 용어를 TF-IDF 가중치에 따라 표시하고, 각 용어의 동의어를 온라인 사전과 같은 맥락에서 사용된 단어를 통해 제공한다.
2. **Scatterplot View**: t-SNE나 LSP 같은 다차원 프로젝션 기법으로 생성된 2D 공간에 전체 문서 컬렉션을 표시한다. 색상으로 문서 상태를 구분한다 (녹색: 쿼리 문서, 파란색: 관련 문서, 빨간색: 비관련 문서, 노란색: 추천 문서, 회색: 미레이블 문서).
3. **Document View**: 선택된 문서의 전체 내용을 표시한다.
4. **Signature List View**: 컬렉션의 3-gram을 빈도 순으로 정렬하여 표시하며, 사용자가 특정 3-gram을 포함하는 모든 문서를 한 번에 관련/비관련으로 레이블링할 수 있게 한다.
5. **Focus List View**: 현재 관련 문서로 레이블된 모든 문서를 표시한다.
6. **Suggestion List View**: 머신러닝 알고리즘이 추천한 20개의 잠재적 관련 문서를 표시한다.

### Key Features for Handling Vocabulary Mismatch
1. **Terms View의 동의어 기능**: 서로 다른 단어가 같은 개념을 설명하는 경우를 처리한다.
2. **Signature List View**: 같은 단어가 다른 의미나 맥락에서 사용되는 경우를 식별할 수 있게 한다. 예를 들어 "cell"이 생물학적 맥락(cancer cells)과 물리학적 맥락(solar cells)에서 다르게 사용되는 것을 구분할 수 있다.

### Machine Learning Integration
FastText 라이브러리를 사용하여 문서 분류와 단어 임베딩을 수행한다. CAL 프로토콜에 따라 사용자가 문서를 레이블링하면 분류기가 재훈련되어 새로운 추천을 생성한다. 문서는 네 가지 클래스로 분류되며 각각 다른 가중치를 부여받는다: Not Relevant (1), Relevant Query (2, 가중치 2), Relevant (3, 가중치 1), Relevant Automatic (4, 가중치 0.5).

## Discussion  
검증 결과에서 몇 가지 중요한 발견이 있었다. 첫째, Signature List View가 false positive를 줄이는 데 핵심적인 역할을 했지만, 여러 문서를 한 번에 "not relevant"로 레이블링하는 기능은 높은 재현율 달성 목표에 부정적 영향을 줄 수 있어 신중히 사용해야 한다. 둘째, 빈도가 1인 3-gram을 제거하는 선택이 특정 시나리오에서 관련 문서를 놓치는 결과를 초래할 수 있다는 것을 발견했다. 향후 연구 방향으로는 다른 유형의 문서 컬렉션에 대한 검증, 문서 표현, 다차원 프로젝션, 유사도 계산 및 텍스트 분류를 위한 기법 옵션 확장, 그리고 더 공식적인 사용자 평가를 통한 검색 및 검색 전략 조사가 포함된다.

## BibTeX Entry
```bibtex
@inproceedings{dias2019trivir,
  title={TRIVIR: A Visualization System to Support Document Retrieval with High Recall},
  author={Dias, Amanda Gon{\c{c}}alves and Milios, Evangelos E. and Oliveira, Maria Cristina Ferreira de},
  booktitle={Proceedings of the ACM Symposium on Document Engineering 2019},
  pages={1--10},
  year={2019},
  organization={ACM}
}
```