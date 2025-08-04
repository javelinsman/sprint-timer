# visualization
## alfradi2015literature
네트워크 시각화 사용하고 문헌 간 유사도에 대한 나름의 메트릭을 만들었음. 더 추천이 잘 된다고 주장함. meta-data analysis의 일종이라고 할 수도 있고, 근데 투명성이 있지는 않고. 네트워크를 쓰니까 landscape overview에도 걸쳐는 있는듯. 하지만 "쿼리 기능"에 가까워 보인다.

## beck2015visual
Survis라는 시스템을 제안. (x=year, y=citationCount, color=citationCount)로 타임라인 보여주기도 하고, 키워드를 wordcloud로 보여주기도 함. 필터같이 생긴 "selector"를 정의하는데 각각이 score가 되어서 여러 요소에 score vector가 작은 vis 형식 (바차트)으로 매핑됨. 약간 Papers101 느낌 있음. K-means로 논문을 클러스터링도 함. 

결과적으로 이 시스템은 meta-data analysis에 매우 속한다. landscape overview는 키워드 (워드 클라우드)로 조금 하게 해주는 것 같기도 하다. Selector와 클러스터링 등은 약간의 visual sensemaking을 지원하는 것 같기도 하지만 사용자 agency는 낮다.

## beck2024puresuggest
Citation을 포함한 메타데이터 분석을 통한 "투명한" 논문 추천. 이것도 굳이 따지면 metadata-driven analysis지만 쿼리 느낌이 강하다. 학술 메타데이터 기반의 쿼리는 투명한 설명이 제공되며, 시각화를 통해 쉽게 그것을 확인할 수 있다는 점도 vis 기반 lit review aid의 큰 theme인듯. 이 theme을 내 리뷰에도 추가해야겠다.

Discussion에서 편향이나 공정성 문제를 살짝 언급하는데 우리도 그런 한계점을 언급한다면 이 논문을 cite하면 되겠다.

## benito2020glassviz
목적의식은 시각화 설계의 관점에서 주제는 다르지만 비슷한 연구를 찾아서 방법론을 전이하기 위함. 소스 셋 2000개랑 타겟 셋 200개를 만들고 데이터 전처리를 엄청 했다고 한다. 그래서 12개의 진입점을 만들고 각 진입점에 키워드끼리 엣지로 연결된 pathfinder 네트워크라는 것을 만들었는데. 무슨 시각환지 전혀 모르겠다? 숏 페이퍼고 학회도 처음 들어봐서 의심스럽다. Swanson의 ABC 모델을 가지고 개념을 3개 층위로 나눴다고 하는데. 어쨌든 이거 인용하지 않아도 될 것 같다.
굳이 인용한다면 이것도 쿼리 느낌의 landscape overview정도가 될거같긴 하고.

## berger2016cite2vec
citation driven embedding을 만들어서 단순 키워드가 아니라 방법론 등 연구의 구성적인 측면에서의 유사도 탐색이 가능하다고 주장. Projection view를 메인으로 활용해 시각적 탐색 가능성도 보여준다. 이것도 쿼리 느낌의 landscape overview...겠지? 확실히 내가 이 theme을 추가해야겠다.

## bergstrom2009augmenting
전형적인 메타데이터 기반 arrangement임. 인용 네트워크를 그냥 보게도 해주고, tree map 형식으로 citation tree를 보여주기도 하고, 타임라인으로 보여주기도 하고. Coauthor net도 보여줌. 이게 "인지적 부하"를 줄이고 "발견가능성"을 높여준다고 함. (이거 우리도 써야겠다. 메타데이터 기반 분석의 효과로)

## breitinger2020supporting 
이것도 인용 기반으로 추천해주는데 시각화 곁들인 전형적인 시도. 유명하지 않은 학회이고 4페이지다. 그저 그렇다.

## chau2011apolo
멋진 논문. 네트워크 분석에 관한 일반적인 논문이지만 문헌 연구를 분명한 사례로 제시하고 있다. Russel의 const structure of sensemaking을 인용하며, 사용자 중심적으로 bottom-up으로 network에서 organization을 해나가는데 그 과정에서 computational하게 "cost" function을 정의해서 인접 노드들을 추천받는다. Visual sensemaking에 매우 특화되어 있으며 여러 고려사항들이 드러난다. 노드와 그룹 간의 many-to-many relationship을 만들 수 있다는 점. 일반적인 그래프 레이아웃은 "센스메이킹"에는 전혀 도움이 되지 않는다며 노드의 지역적 부분집합을 rank-in-place하는 기능 등이 있다.

우리 시스템과 겹치는 부분은, 어쨌든 sensemaking을 한 토대 위에서 정의되는 쿼리를 통해서 locally 확장한다는 점. visual sensemaking을 지원한다는 점 등이 있겠다. 단 여기서는 computational한 방법으로 cost를 정의했지만 우리는 그거보다는 좀 더 직접적이고 설명가능한 메타데이터 기반의 발견 및 설명(=시각화로 보여주니까 당연히 설명된다)한다는 점이 다르겠다.

## chen1999visualising
1999년 논문 ㄷㄷㄷ. 하지만 Pathfinder network를 활용한 근본인 것 같다. 두 논문/저자를 동시에 인용하는 논문의 개수를 두 논문/저자 간의 weight로 삼아서 pathfinder scaling을 했고 그걸 통해 실제로 의미있는 거시적 분석이 가능하다는 것을 보여주었다.
Pathfinder network를 약간은 우리 rel work에서 소개할 필요가 있겠다. 일단 확실하게 이 논문은 landscape overview에 관한 논문이구나.

## chen2010structure
위에랑 같은 chen임. 공동인용 기반의 분석을 더 고도화하는 계산적인 방법을 제안함. 클러스터로 partition하고, 각각 레이블링을 하고 (텍스트 기반으로). 그다음에 CiteSpace라는 시각화 시스템을 제안하는데, 클러스터 뷰랑 타임라인 뷰가 있다. 둘다 클러스터를 기본 구성 요소로 해서 네트워크 또는 타임라인 시각화를 한 것이다. 클러스터에 컬러코딩을 하는데 반지름축이 시간축이고 ring의 색상이 인용폭발 아니면 중심성 같은것을 나타낸다고 한다.
이것도 고도화된 landscape overview다.

## choe2021papers101
메타데이터 기반의 투명한 쿼리의 수행 및 시각적 설명.



# text