import { Request, Response } from 'express';
import Domain, { IDomain } from "../models/Domain"
import { Get, Post, Route } from "tsoa";

@Route("domain")
export default class DomainController {

  getParent(hier: Record<string, any>, parent_id?: string): any {
    if (!hier || !parent_id) return;
    let parent = hier[parent_id];
    if (parent) return parent;
    for(const [key, value] of Object.entries(hier)) {
      if (!value.domains) continue;
      parent = value.domains[parent_id];
      if (parent) { 
        return parent;
      } else {
        let child = this.getParent(value.domains, parent_id);
        if (child) return child;
      }
    }
  }

  gethieraricalDomains = async() => { 
    let domains = await Domain.aggregate([
      {
        $graphLookup: {
          from: "domains",
          startWith: "$id",
          connectFromField: "parent_id",
          connectToField: "id",
          as: "hierarchy"
        }
      },
      {
        $sort: {
          level: 1
        }
      }
    ]);

    let hier: Record<string, any> = {};
    for(let d of domains) {
      if (d.level === 1) {
        if (!hier[d.id]) {
          hier[d.id] = { id: d.id, text: d.text, level: d.level, domains: {} };
        }
      } else {
        let hiers: IDomain[] = d.hierarchy?.sort((a: IDomain, b: IDomain) => a.level - b.level);
        for(let h of hiers) {
          if (h.level === 1) continue;
          let parent = this.getParent(hier, h.parent_id);
          if (parent && parent.domains && !parent.domains[h.id]) {
            parent.domains[h.id] = { id: h.id, text: h.text, level: h.level, domains: {} };
          }
        }
      }
    }
    
    return hier;
  }

  @Get("/")
  public getDomain  = async (req: Request, res: Response): Promise<void> => {
    try {
      const domains = await this.gethieraricalDomains();
      //console.log("All domains: ", domains);
      res.status(200).json({ domains: domains })
    } catch (error) {
      throw error
    }
  }

  @Post("/")
  public addDomain = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as Pick<IDomain, "id" | "text" | "parent_id" | "level" | "modified_on">
  
      const domain: IDomain = new Domain({
        id: Date.now().toString(),
        text: body.text,
        parent_id: body.parent_id,
        level: body.level,
        modified_on: body.modified_on
      })
  
      const newDomain: IDomain = await domain.save();
      const allDomains = await this.gethieraricalDomains();
  
      res
        .status(201)
        .json({ message: "Domain added", domain: newDomain, domains: allDomains })
    } catch (error) {
      throw error
    }
  }
}