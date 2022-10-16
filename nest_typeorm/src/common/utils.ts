/**
 * transform the given data to nested tree structure
 * @param {Object}  rawData[] - array of objects
 * @returns {Object} nested tree structure
 */
export const treeTransformer = (rawData: any[]) => {
  const idMapping = rawData.reduce((acc, item, index) => {
    acc[item.menuId] = index;
    return acc;
  }, {});

  const root: any = [];
  rawData.forEach((item) => {
    if (item.parentId === null) {
      root.push(item);
      return;
    }
    const parent = rawData[idMapping[item.parentId]];
    parent.children = [...(parent.children || []), item];
  });
  return root;
};
