import { stickersService } from "@/services/giphy.stickers.service";
import { useInfiniteQuery } from "@tanstack/react-query";

const MOCK_STICKERS = [
  {
    id: "mock1",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmszYW1yY2dzbWNrdmh1cnphN2dnb3IzaDNoc3d6aGlqNXpiYnR3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cYZkY9HeKgofpQnOUl/giphy.gif",
  },
  {
    id: "mock2",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm92aGNqY2FueHdjOThrMDNoM25raXJhOHU5NTM1eTY1ZDdjd3Q2aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hQKiGV6MG8WmsHg2yx/giphy.gif",
  },
  {
    id: "mock3",
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHY5M3ZpZzRnd3BieHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX3N0aWNrZXJzX3NlYXJjaCZjdD1z/3o7TKVUn7iM8FMEU24/giphy.gif",
  },
  {
    id: "mock4",
    url: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2R3OXN0YXBpdHg1YXJucnRoZXoycW12Z2wxM2NmYjlpb2JmajJrdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ylyUQlf4VUVF9odXKU/giphy.gif",
  },
  {
    id: "mock5",
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDB3MHZ1dDRlOGh2aXlibml0eGtnZnN3dzlrbGV0YnlzenAzOGw5cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/t1cAc8BKJ51HBiBfbO/giphy.gif",
  },
  {
    id: "mock6",
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTRvMjB6ZnoxdTh1NW1tcW04MXo4YnJ6a3N2NnZ1aHN2ZWhydHFjaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0ExayQDzrI2xOb8A/giphy.gif",
  },
  {
    id: "mock7",
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHNxMmpuajR3MWk1cmJrcHQwejFpencxNTRyczY1c3JpaDU0MmIwZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs4qw8hkPShGeanS/giphy.gif",
  },
  {
    id: "mock8",
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzB2cXlvNnZlaG9kMWVueThydHZyeXRlZzFnc2N5eHczZnpxdG01ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/I2BdUfzAO6VKj8FD6H/giphy.gif",
  },
  {
    id: "mock9",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGNncDRuaTRzc29nN2xwZmEyY2Zua3Y4ZjBxamhkeDhoeTg2N2xiYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WXB88TeARFVvi/giphy.gif",
  },
  {
    id: "mock10",
    url: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTkxZWRldHp5cmFzcXVydGVhZWh3bzM3dWpmN3B1bTBhd3d2aWc1eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sr8jYZVVsCmxddga8w/giphy.gif",
  },
  {
    id: "mock11",
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHI1czMxcDY1bG1ldXB6azZ1cjVzbGYzY3NoZ3ViaDF5Z29jeGEzbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Xw6yFn7frR3Y4/giphy.gif",
  },
  {
    id: "mock12",
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHkwc3Zkc3ZtMDdrZmZlb2VyNHd6bGFrZXB4dW04aGt1cThzcTRmcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fUYhyT9IjftxrxJXcE/giphy.gif",
  },
  {
    id: "mock13",
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGN2cHZlcTFhYzhweGJva3Y1cnh4aG83d3hmanBuNmZ5Znh3M3Y0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F0Z9Fi4eB4YXr4FURN/giphy.gif",
  },
  {
    id: "mock14",
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWE2N3Brcmh4bzE3MzhnNWcyZzVycjk0OXo1NzRoaHFkOXhjYWE3MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zXU2uhd1kvn32/giphy.gif",
  },
  {
    id: "mock15",
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2RqdGUxYXBvbTAwNDN0dHo5ZjdteGthaGgxcHphb2Y5anVvNzRuNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fHoqSTQTsgSbfUoiTw/giphy.gif",
  },
  {
    id: "mock16",
    url: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjI2ZWE3YnRqZHR1Y3IxNHl0dm5kYXU3cmxndnVrb2dobWZlcndxdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IfPE0x5gfa5ctKpph6/giphy.gif",
  },
  {
    id: "mock17",
    url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWx5bmdhNDR2NTh1dWxocnkweXFxMjA3aG1sd3ptMXlxMzB5MXFudyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xqBpxjk7CXLtm/giphy.gif",
  },
  {
    id: "mock18",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHhrbmp4Y3B1dnQyYTJ5YzEzZnRkZnZkdTRpdnloYW9uMGQyMWo3byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/as521kub4b68hW2JhK/giphy.gifhttps://media0.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif",
  },
  {
    id: "mock19",
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGp3dTg2aXdvZDJuaHk3aGk0ZTRzZzM2ZzlmZXluZ2Z5MTZmeW5hMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0ixAZaU8Gp8R5TdRQT/giphy.gif",
  },
  {
    id: "mock20",
    url: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGk4bDFqdGMwd2Q5dWpqOGJob2FzbTZzc3J3aTZjaDFveGJvaXRjNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CciM7ZRcjqY6P7HHdd/giphy.gif",
  },
];

export const useStickers = (
  query: string = "",
  active: string,
  limit: number = 21,
) => {
  return useInfiniteQuery({
    queryKey: ["stickers", query ? "search" : "trending", query, limit],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const res = query
          ? await stickersService.searchStickers(query, limit, pageParam)
          : await stickersService.getTrendingStickers(limit, pageParam);

        return {
          items: res.data.map((item: any) => ({
            id: item.id,
            url: item.images.fixed_height_small.url,
          })),
          nextOffset: pageParam + limit,
          hasMore: res.pagination.total_count > pageParam + limit,
        };
      } catch (error) {
        console.warn("Stickers API Quota exceeded or failed. Using mock data.");
        return {
          items: MOCK_STICKERS,
          nextOffset: 0,
          hasMore: false,
        };
      }
    },
    initialPageParam: 0,
    enabled: active === "stickers",
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    staleTime: 1000 * 60 * 10,
  });
};
