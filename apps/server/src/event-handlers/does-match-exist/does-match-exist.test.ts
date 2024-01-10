import { afterEach } from "node:test";
import { describe, it, vi, expect } from "vitest";
import * as repo from "../../db/repository";
import onDoesMatchExist from "./index";

vi.mock("../../db/repository");

const mockRepo = vi.mocked(repo);

describe('doesMatchExist', () => {

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return true if the match exists', async () => {
    mockRepo.doesMatchExist.mockResolvedValue(1);

    const callback = vi.fn();

    await onDoesMatchExist("matchId", callback);

    expect(callback).toHaveBeenCalledWith(true);
  });

  it('should return false if the match does not exist', async () => {
    mockRepo.doesMatchExist.mockResolvedValue(0);

    const callback = vi.fn();

    await onDoesMatchExist("matchId", callback);

    expect(callback).toHaveBeenCalledWith(false);
  });
});
