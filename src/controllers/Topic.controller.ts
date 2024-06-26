import { Request, Response } from "express";
import {
  createTopicService,
  getTopicsService,
} from "../services/Topic.services";
import Topic from "../models/Topic.model";
import Challenge from "../models/Challenge.model";

const createTopic = async (req: Request, res: Response) => {
  if (req.headers.role !== "admin") {
    res.status(401).json({ message: "Forbidden" });
    return;
  }
  const topic: { topicName: string; description?: string; imageUrl?: string } =
    req.body;
  try {
    // Your logic here
    if (!topic.topicName) {
      res.status(400).json({ message: "Name is required" });
      return;
    }
    const response = await createTopicService(topic);
    res.status(response.status).json(response.message);
    // Sending the response
  } catch (error) {
    // Handling errors
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTopics = async (req: Request, res: Response) => {
  const { topicName } = req.query;

  const queries = topicName
    ? { topicName: { $regex: topicName, $options: "i" } }
    : {};

  const skip = (Number(req.query.page) - 1) * Number(req.query.pageSize);
  const limit = Number(req.query.pageSize) || 10;

  console.log(queries);

  try {
    const topics = await getTopicsService(queries, skip, limit);
    res.status(topics.status).json(topics.message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTopic = async (req: Request, res: Response) => {
  if (req.headers.role !== "admin") {
    res.status(401).json({ message: "Forbidden" });
    return;
  }
  const topicId = req.params.topicId;
  console.log(topicId);
  const updateTopic: { topicName: string; description?: string } = req.body;

  const topic = await Topic.findOne({ _id: topicId });
  if (!topic) {
    res.status(404).json({ message: "Topic not found" });
    return;
  }

  const isDuplicateName = await Topic.findOne({
    topicName: updateTopic.topicName,
  });

  if (
    isDuplicateName &&
    isDuplicateName._id.toString() !== topicId.toString()
  ) {
    res.status(400).json({ message: "Topic name already exists" });
    return;
  }

  try {
    await Topic.updateOne({ _id: topicId }, updateTopic);
    res.status(200).json({ message: "Topic updated" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteTopic = async (req: Request, res: Response) => {
  if (req.headers.role !== "admin") {
    res.status(401).json({ message: "Forbidden" });
    return;
  }
  const topicId = req.params.topicId;
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      res.status(404).json({ message: "Topic not found" });
      return;
    }
    await Topic.deleteById(topicId);
    await Challenge.delete({ topicId: topicId });
    res.status(200).json({ message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find();
    res.status(200).json({ topics: topics });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createTopic, getTopics, updateTopic, deleteTopic, getAllTopics };
