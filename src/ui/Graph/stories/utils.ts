// const start = segmentData?.start;
// const end = segmentData?.end;

export const mapOntology = (ontology: any[]) => {
  const identityMap: any = {};

  const relationships = ontology.reduce((accum, el, index) => {
    const segmentData = el.p?.segments?.[0];
    const { start, end, relationship } = segmentData;

    identityMap[start.identity] = { id: start.properties.name };
    identityMap[end.identity] = { id: end.properties.name };

    if (relationship) {
      accum.push(relationship);
    }

    return accum;
  }, []);

  const nodes = Object.keys(identityMap).map((id: any) => {
    return identityMap[id];
  });

  const links = relationships.map((relationship: any) => {
    return {
      source: identityMap[relationship.start],
      target: identityMap[relationship.end]
    };
  });

  return { nodes, links };
};
