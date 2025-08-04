# CiteSee: Augmenting Citations in Scientific Papers with Persistent and Personalized Historical Context

## Overview
### Problem Statement
문헌 검토 중 학술 논문을 읽을 때 인라인 인용은 연구자들이 현재 논문을 맥락화하고 관련 선행 연구를 발견하는 데 도움을 준다. 그러나 문헌 검토 과정에서 마주치는 수백 개의 인용 중 어떤 것을 우선순위로 둘지, 어떻게 이해할지는 매우 어려운 과제이다. 특히 독자의 관심사와 관련된 인용을 식별하고, 여러 논문에서 반복적으로 나타나는 중요한 인용을 추적하는 것은 현재의 읽기 도구로는 비현실적이다.

### Approach
CiteSee는 사용자의 출판, 읽기, 저장 활동을 활용하여 인용 주변에 개인화된 시각적 증강과 맥락을 제공하는 논문 읽기 도구이다. 사용자가 이전에 인용했거나 열어본 알려진 인용을 표시하여 현재 논문을 친숙한 맥락과 연결하고, 저장 및 읽기 이력을 기반으로 관련성 있지만 알려지지 않은 인용을 강조 표시하여 사용자의 탐색 우선순위를 정하는 데 도움을 준다.

### Contribution
1) 개인화된 읽기 경험에 초점을 맞춘 과학 논문 읽기 도구 CiteSee 프로토타입 개발. 2) 사용자의 이전 활동과 연결된 인라인 인용을 증강하고 일관되고 개인화된 역사적 맥락을 제공하는 메커니즘. 3) 논문 발견에 대한 통제된 실험실 연구(N=10)에서 세 가지 베이스라인보다 현저히 효과적임을 입증. 4) 실제 문헌 검토 작업에 대한 현장 배포 연구(N=6)에서 CiteSee가 참가자들의 탐색 추적을 돕고 인라인 인용을 통한 논문 발견율을 2.7배 증가시켰음을 확인.

## Introduction
과학은 타인의 과거 연구 위에 구축된다. 연구자들은 기존 지식을 종합하고, 연구 기회를 식별하며, 미래 연구를 위한 영감을 찾기 위해 선행 연구를 활용한다. 과학 논문을 읽는 것은 문헌을 탐색하고 학습하는 기본적인 방법 중 하나이며, 특히 관련 연구 섹션은 인라인 인용을 통해 추가적인 관련 논문을 발견하고 연결할 수 있게 해준다. 인라인 인용은 논문 발견의 핵심 자원으로, 한 설문 연구에 따르면 연구 중 논문 발견의 약 5분의 1(21%)이 인라인 인용을 통해 이루어진다고 추정된다. 그러나 독자의 관심사와 관련된 인용의 하위 집합만이 관련성이 있을 것이며, 문헌 검토 중 수십 또는 수백 개의 인라인 인용을 포함할 수 있는 많은 논문을 읽고 훑어봐야 하는 상황에서 어떤 인용에 주의를 기울일지 우선순위를 정하기는 어렵다.

## Related Work
이 연구는 탐색적 검색, 센스메이킹, 정보 수렵 행동에 대한 선행 연구를 기반으로 시스템 설계를 안내한다. 문헌 검토 과정은 탐색적 성격을 가지며, 사용자는 초기에 명확한 정보 탐색 목표가 없을 수 있지만 문헌을 탐색하고 학습하면서 목표를 구체화한다. 사용자는 종종 각 문서를 깊이 읽기보다는 훑어보고 많은 수의 과학 논문 사이를 전환하여 정보 수렵 효율성을 최적화한다. 과학 논문 읽기 인터페이스에 대한 연구는 문서 내 및 문서 간 상호 참조를 더 잘 지원하는 데 초점을 맞춰왔다. 초기 연구는 머신러닝 기술을 사용하여 연구 논문의 인라인 인용을 식별하고 참고문헌 섹션의 항목에 매핑하여 사용자가 인용을 맥락화하는 데 드는 높은 상호작용 비용을 피할 수 있도록 했다. 논문 추천 및 탐색 분야에서는 머신러닝 연구자들이 논문 내용, 인용 그래프 또는 이 둘의 조합을 기반으로 추천을 제공하는 추천 시스템에 중점을 두었고, HCI 연구자들은 인용 그래프를 탐색하기 위한 대화형 시각 인터페이스를 탐구했다. 그러나 이전 시스템들은 별도의 맞춤형 인터페이스 개발에 중점을 두었고 학자들이 선행 연구를 인식하는 중요한 비율을 차지하는 읽기 중 논문 발견을 지원하지 않았다.

## Preliminary Interviews
초기 단계에서 연구자들이 읽기 중 인라인 인용을 어떻게 이해하는지, 문헌 검토 중 발생하는 일반적인 한계와 필요를 더 잘 파악하기 위해 예비 인터뷰를 실시했다. 다양한 연구 배경과 경험을 가진 5명의 참가자(산업 연구 관리자 1명, 조교수 1명, 박사과정 학생 2명, 박사 전 연구원 1명)를 모집했다. 인터뷰에서는 8개의 과학 논문 리더 인터페이스 목업을 디자인 프로브로 사용했다. 주요 발견 사항은 다음과 같다: 1) 중요한 인용을 놓치는 것에 대한 두려움 - 참가자들은 밀접하게 관련된 선행 연구를 인식하지 못할 때의 심각한 결과를 설명했다. 2) 진행 상황 추적 및 맥락 손실 - 참가자들은 저장된 논문 주변에 충분한 맥락을 유지하는 것이 어렵다고 설명했다. 3) 일관된 주석과 맥락의 필요성 - 모든 참가자가 다른 논문을 읽을 때 동일한 인용에 대해 일관된 주석과 맥락을 갖는 아이디어에 긍정적으로 반응했다.

## System Design
CiteSee는 사용자의 읽기 이력과 논문 라이브러리를 추적하여 인라인 인용을 시각적으로 증강한다. 시스템은 다섯 가지 유형의 시각적 증강을 제공한다: 1) 재만남 인용(Reencountered Citations) - 사용자의 읽기 이력에 있는 다른 논문에도 나타난 인용을 노란색에서 주황색까지 다양한 색조로 강조 표시. 2) 방문한 논문(Visited Papers) - 이전에 열어본 논문에 대한 인용을 녹색으로 표시. 3) 저장된 논문(Saved Papers) - 사용자의 라이브러리 폴더에 저장된 논문에 대한 인용을 빨간색으로 표시. 4) 인용한 논문(Cited Papers) - 사용자의 출판물에서 인용한 논문을 빨간색 따옴표로 표시. 5) 자신의 논문(Own Papers) - 사용자의 이전 출판물에 대한 인용에 하트 이모지 표시. CiteSee는 또한 인라인 인용을 클릭할 때 Paper Card에서 개인화된 맥락을 제공한다. 여기에는 인용된 논문의 제목, 저자, 초록과 함께 사용자가 최근 읽은 논문에서의 인용 문장, 논문이 저장된 맥락 등이 포함된다. 시스템은 사용자의 참여 수준을 측정하는 휴리스틱을 사용하여 각 인라인 인용의 관심도를 추정한다: 읽기 이력의 각 인용 논문은 1점, 추가로 읽은 비율에 따라 0-1점, 라이브러리에 저장된 논문은 2점을 추가로 부여한다.

## Study 1: Discover Relevant Citations
연구 1의 목표는 CiteSee의 재만남 인용 강조 표시 접근법을 세 가지 베이스라인과 비교하여 검증하는 것이었다. 10명의 참가자가 세 가지 주제 중 하나를 선택하여 세 편의 논문을 읽고 문헌 검토에 도움이 되는 인용을 찾는 과제를 수행했다. 네 가지 전략으로 인용을 선택했다: 1) 재만남 인용(시스템) - 다른 두 논문에서도 인용된 인용 선택. 2) 선형 읽기 - 처음 다섯 개 인용 선택. 3) 전역 인용 수 - 가장 많이 인용된 다섯 논문 선택. 4) Specter 유사성 - 의미적 임베딩을 사용하여 세 논문의 평균 벡터와 가장 유사한 다섯 인용 선택. 결과는 재만남 인용 전략이 세 가지 베이스라인 전략보다 현저히 우수함을 보여주었다. 누적 링크 혼합 모델 분석에서 재만남 인용(β = 2.23, p < 0.001)과 Specter(β = 0.65, p < 0.01)만이 리커트 응답에 유의미하고 긍정적인 영향을 미쳤다. 무작위화 테스트를 통해 재만남 인용이 Specter보다도 유의미하게 우수함을 확인했다(p < 0.001).

## Study 2: Field Deployment
6명의 참가자가 1-2주 동안 실제 문헌 검토 작업에 CiteSee를 사용했다. 참가자들은 평균 39.3개의 논문을 열었고 25.8개의 논문을 저장했다. 주요 발견 사항은 다음과 같다: 1) 인라인 인용을 통한 논문 발견이 이전 조사에서 보고된 21%보다 2.7배 높은 57%를 차지했다. 2) 재만남 인용이 전체 인라인 인용의 8.2%만 차지했지만, Paper Card 접근의 37%를 차지하여 참가자들이 이를 우선적으로 검토했음을 보여준다. 3) 재만남 인용을 검토할 때 유용한 선행 연구를 발견할 확률이 거의 3배 높았다. 질적 인터뷰에서 참가자들은 전역 인용 수와 재만남 인용이 상호 보완적이라고 설명했으며, 전자는 논문의 품질을 추정하는 대리 지표로, 후자는 관련성을 판단하는 더 나은 신호로 활용했다. CiteSee는 또한 논문 간 빠른 판단, 문서 내 스키밍, 과거 논문 기억, 여러 논문에 걸친 센스메이킹을 지원했다. 특히 참가자 중 4명이 연구 종료 후에도 2개월 이상 CiteSee를 계속 사용했다는 점은 주목할 만하다.

## Discussion
저자들은 몇 가지 제한사항과 향후 연구 방향을 논의한다. 첫째, 여러 작업을 위한 읽기를 교차하는 사용자를 위한 더 나은 지원이 필요하다. 둘째, 단순한 5점 휴리스틱이 장기간 사용 시 과포화될 수 있으므로 더 정교한 접근법 개발이 필요하다. 셋째, 인용 기반 추천의 에코 챔버 효과를 완화하기 위해 의미적 유사성 신호를 통합하는 방법을 고려해야 한다. 넷째, 여러 논문에 걸친 수동 노트 작성과 종합을 지원하는 방향으로 확장할 수 있다. 특히 과학적 개념에 대한 일관된 Concept Cards를 지원하여 학습자가 최근 읽은 논문에서 수집한 관련 단락과 이전 노트를 볼 수 있도록 하는 것이 유망한 방향이다.

## BibTeX Entry
```bibtex
@inproceedings{10.1145/3544548.3580847,
author = {Chang, Joseph Chee and Zhang, Amy X. and Bragg, Jonathan and Head, Andrew and Lo, Kyle and Downey, Doug and Weld, Daniel S.},
title = {CiteSee: Augmenting Citations in Scientific Papers with Persistent and Personalized Historical Context},
year = {2023},
isbn = {9781450394215},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3544548.3580847},
doi = {10.1145/3544548.3580847},
abstract = {When reading a scholarly article, inline citations help researchers contextualize the current article and discover relevant prior work. However, it can be challenging to prioritize and make sense of the hundreds of citations encountered during literature reviews. This paper introduces CiteSee, a paper reading tool that leverages a user's publishing, reading, and saving activities to provide personalized visual augmentations and context around citations. First, CiteSee connects the current paper to familiar contexts by surfacing known citations a user had cited or opened. Second, CiteSee helps users prioritize their exploration by highlighting relevant but unknown citations based on saving and reading history. We conducted a lab study that suggests CiteSee is significantly more effective for paper discovery than three baselines. A field deployment study shows CiteSee helps participants keep track of their explorations and leads to better situational awareness and increased paper discovery via inline citation when conducting real-world literature reviews.},
booktitle = {Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems},
articleno = {737},
numpages = {15},
keywords = {personalization, reading interfaces, scientific papers},
location = {Hamburg, Germany},
series = {CHI '23}
}
```