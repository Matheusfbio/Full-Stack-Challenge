"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { FiMoreVertical } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Definição da interface Item
interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
}

// Mapeamento de ícones por categoria
const categoryIcons: Record<string, string> = {
  fruta: "🍎",
  padaria: "🥖",
  legume: "🥦",
  bebida: "🥤",
  carne: "🥩",
};

// Função para buscar os itens da lista
const fetchItems = async (): Promise<Item[]> => {
  const { data } = await axios.get("http://localhost:5000/api/shopping-list");
  return data;
};

export default function Home() {
  const { data: items, isLoading } = useQuery<Item[]>({
    queryKey: ["shoppingList"],
    queryFn: fetchItems,
  });
  const queryClient = useQueryClient();

  // Removed unused toggleItem

  const toggleItemCompleted = useMutation({
    mutationFn: async (item: Item) => {
      await axios.put(`http://localhost:3001/api/shopping-list/${item.id}`, {
        ...item,
        completed: !item.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
    },
  });

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center">🛒 Lista de Compras</h1>

      <div className="mt-6 max-w-2xl mx-auto space-y-4">
        {isLoading
          ? [...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))
          : items?.map((item: Item) => (
              <Card
                key={item.id}
                className={clsx(
                  "flex items-center p-4 rounded-lg border shadow-lg transition-all bg-neutral-800 hover:bg-neutral-700 cursor-pointer",
                  { "opacity-50": item.completed }
                )}
              >
                <CardContent className="flex items-center w-full space-x-4">
                  {/* Checkbox para marcar como concluído */}
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompleted.mutate(item)}
                    className="w-5 h-5 accent-indigo-500"
                  />

                  {/* Nome e quantidade do item */}
                  <div className="flex-1">
                    <span className="text-lg font-semibold">{item.name}</span>
                    <p className="text-sm text-neutral-400">
                      {item.quantity} {item.unit}
                    </p>
                  </div>

                  {/* Categoria com ícone */}
                  <Badge
                    variant="secondary"
                    className="flex items-center px-3 py-1"
                  >
                    {categoryIcons[item.category] || "🛍️"} {item.category}
                  </Badge>

                  {/* Ícone de opções */}
                  <FiMoreVertical className="ml-3 text-neutral-400 hover:text-white cursor-pointer" />
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
