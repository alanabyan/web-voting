import express from "express";
import prisma from "../libs/prisma";
import candidateSchema from "../validation/candidateSchema";
export const getCandidates = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await prisma.candidate.findMany();
    res.status(200).json({
      message: "get candidates successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "PrismaClientKnownRequestError") {
        return res.status(400).json({
          message: "Database error occurred while fetching candidates",
          error: error.message,
        });
      }
      return res.status(500).json({
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export const getCandidateById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      message: "Get candidate successfully",
      data: candidate,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "PrismaClientKnownRequestError") {
        return res.status(400).json({
          message: "Database error occurred while fetching candidate",
          error: error.message,
        });
      }
      return res.status(500).json({
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export const createCandidate = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, vision, mission } = candidateSchema.parse(req.body);
  const image = req.file?.filename;

  try {
    if (!image) return res.status(400).json({ message: "Image is required" });

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        vision,
        mission,
        image,
      },
    });
    res
      .status(201)
      .json({ message: "Candidate created successfully", newCandidate });
  } catch (error: string | any) {
    res.status(500).json({
      message: "Failed to create candidate",
      error: error.message,
    });
  }
};

export const updateCandidate = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const { name, vision, mission } = candidateSchema.parse(req.body);
  try {
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id,
      },
      data: {
        name,
        vision,
        mission,
      },
    });
    res
      .status(201)
      .json({ message: "Candidate updated successfully", updatedCandidate });
  } catch (error: string | any) {
    res.status(500).json({
      message: "Failed to update candidate",
      error: error.message,
    });
  }
};

export const deleteCandidate = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const deletedCandidate = await prisma.candidate.delete({
      where: {
        id: id,
      },
    });
    res
      .status(200)
      .json({ message: "Candidate deleted successfully", deletedCandidate });
  } catch (error: string | any) {
    res.status(500).json({
      message: "Failed to delete candidate",
      error: error.message,
    });
  }
};
