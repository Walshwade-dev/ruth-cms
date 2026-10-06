import { LearningNode } from "@/data/learning";

interface DevelopmentNodeProps {
  node: LearningNode;
  type: "area" | "skill";
}

export function DevelopmentNode({ node, type }: DevelopmentNodeProps) {
  return (
    <div className={`p-4 md:p-6 rounded-xl border ${type === "area" ? "bg-background border-golden/20" : "bg-foreground/5 border-transparent"} flex flex-col justify-center h-full`}>
      <h3 className="font-serif text-lg font-bold text-foreground flex items-center">
        <span className={`inline-block w-2 h-2 rounded-full mr-3 ${type === "area" ? "bg-golden" : "bg-foreground/40"}`}></span>
        {node.name}
      </h3>
      {node.description && (
        <p className="mt-2 text-sm text-foreground/70 ml-5">
          {node.description}
        </p>
      )}
    </div>
  );
}
