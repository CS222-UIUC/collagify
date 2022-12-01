// This class should be treated as immutable, since it will be used as a react state
// All mutator methods must return a modified copy of the object
export class Collage {
  covers: string[];

  rows: number;
  cols: number;

  valid_dims: number[][];
  dim_index: number;

  gap: number;

  constructor(covers: string[]) {
    // limit number of covers
    const kMaxCovers = 100;
    this.covers = covers.slice(0, kMaxCovers);

    // find default dimensions and all possible dimensions 
    this.valid_dims = this.findValidDims(this.covers.length);
    const default_index = Math.floor(this.valid_dims.length / 2);
    this.dim_index = default_index;
    this.rows = this.valid_dims[default_index][0];
    this.cols = this.valid_dims[default_index][1];

    this.gap = 0;
  }

  public setDims = (index: number) => {
    let to_return = this;
    this.rows = this.valid_dims[index][0];
    this.cols = this.valid_dims[index][1];
    return this;
  }

  public swapCover = (first: number, second: number) => {
    [this.covers[first], this.covers[second]] = [this.covers[second], this.covers[first]];
    return this;
  }

  public setGap = (gap: number) => {
    this.gap = gap;
    return this;
  }

  // given the number of rows in a collage and the total number of covers
  // find the minimal number of cols to contain all thecovers
  private findColFromRow = (num_covers: number, num_rows: number) : number => {
    return Math.ceil(num_covers / num_rows);
  }

  /**
   * Return a list of all valid dimensions (# of rows and columns) of a collage
   * 
   * @param num_covers the number of covers in the collage
   * @returns A list of valid dimensions. list[i][0] and list[i][1] represents 
   * the # of rows and columns in the i-th valid dimension respectively
   */
  private findValidDims = (num_covers: number) : number[][] => {
    let to_return : number[][] = [];
    for (let num_rows = 1; num_rows <= num_covers; num_rows++) {
      let num_cols = this.findColFromRow(num_covers, num_rows);
      // There must not be empty rows
      if (num_covers > num_cols * (num_rows - 1)) {
        to_return.push([num_rows, num_cols]);
      }
    }
    return to_return;
  }
  
}