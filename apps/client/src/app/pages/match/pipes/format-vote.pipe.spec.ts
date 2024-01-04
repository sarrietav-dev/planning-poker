import { FormatVotePipe } from './format-vote.pipe';

describe('FormatVotePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatVotePipe();
    expect(pipe).toBeTruthy();
  });

  describe('FormatVotePipe', () => {
    let pipe: FormatVotePipe;

    beforeEach(() => {
      pipe = new FormatVotePipe();
    });

    it('create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should return "1 voto" when value is 1', () => {
      expect(pipe.transform(1)).toEqual("1 voto");
    });

    it('should return "2 votos" when value is 2', () => {
      expect(pipe.transform(2)).toEqual("2 votos");
    });

    it('should return "0 votos" when value is 0', () => {
      expect(pipe.transform(0)).toEqual("0 votos");
    });
  });
});
