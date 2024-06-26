import { Request, Response } from "express";
import {
  createChallengeService,
  getChallengeService,
  getChallengeListService,
  updateChallengeService,
  deleteChallengeService,
  getAllChallengeService,
  getStatisticsService,
  getMostPlayedChallengeService,
} from "../services/Challenge.services";

const getAllChallenge = async (req: Request, res: Response) => {
  const response = await getAllChallengeService();
  res.status(response.status).json(response.message);
};

const getChallenge = async (req: Request, res: Response) => {
  const challengeId = req.params.challengeId;
  const response = await getChallengeService(challengeId);
  res.status(response.status).json(response.message);
};

const getChallengeList = async (req: Request, res: Response) => {
  let queries = req.query;

  try {
    const response = await getChallengeListService(queries);
    res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createChallenge = async (req: Request, res: Response) => {
  const { challengeName, level, topicId, imageUrl, description } = req.body;
  let error = [];
  if (!challengeName) {
    error.push("Challenge name is required");
  }
  if (!level) {
    error.push("Level is required");
  }
  if (!topicId) {
    error.push("topicId is required");
  }
  if (error.length > 0) {
    res.status(400).json({ message: error });
    return;
  }

  let point;
  switch (level) {
    case "easy":
      point = 100;
      break;
    case "medium":
      point = 200;
      break;
    case "hard":
      point = 300;
      break;
    default:
      res.status(400).json({ message: "Invalid level" });
      return;
  }

  const response = await createChallengeService({
    challengeName,
    level,
    topicId,
    point,
    imageUrl,
    description,
  });
  res.status(response.status).json(response.message);
};

const updateChallenge = async (req: Request, res: Response) => {
  if (req.headers.role !== "admin") {
    res.status(401).json({ message: "Forbidden" });
    return;
  }

  console.log(req.body);

  const challengeId = req.params.challengeId;
  const updateChallenge: {
    challengeName: string;
    level: string;
    topicName: string;
    point: number;
    imageUrl?: string;
    description?: string;
  } = req.body;

  console.log(updateChallenge);

  const response = await updateChallengeService(challengeId, updateChallenge);
  res.status(response.status).json(response.message);
};

const deleteChallenge = async (req: Request, res: Response) => {
  if (req.headers.role !== "admin") {
    res.status(401).json({ message: "Forbidden" });
    return;
  }
  const challengeId = req.params.challengeId;
  const response = await deleteChallengeService(challengeId);
  res.status(response.status).json(response.message);
};

const getStatistics = async (req: Request, res: Response) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  if (!startDate || !endDate) {
    res.status(400).json({ message: "startDate and endDate are required" });
    return;
  }
  const response = await getStatisticsService(startDate, endDate);
  res.status(response.status).json(response.message);
};

const getMostPlayedChallenge = async (req: Request, res: Response) => {
  const response = await getMostPlayedChallengeService();
  res.status(response.status).json(response.message);
};

export {
  getAllChallenge,
  createChallenge,
  getChallengeList,
  updateChallenge,
  getChallenge,
  deleteChallenge,
  getMostPlayedChallenge,
  getStatistics,
};
