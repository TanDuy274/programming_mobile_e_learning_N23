import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useFetchData } from "@/hooks/useFetchData";
import api from "@/api/api";

// Mock api
jest.mock("@/api/api");
const mockApi = api as jest.Mocked<typeof api>;

// Mock Toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("useFetchData hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("UT-049: should fetch data successfully from single endpoint", async () => {
    const mockData = { docs: [{ id: 1, name: "Test" }] };
    mockApi.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useFetchData(["/categories"]));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([mockData]);
    expect(mockApi.get).toHaveBeenCalledWith("/categories");
  });

  it("UT-050: should fetch data from multiple endpoints", async () => {
    const mockData1 = { docs: [{ id: 1 }] };
    const mockData2 = { docs: [{ id: 2 }] };

    mockApi.get.mockResolvedValueOnce({ data: mockData1 });
    mockApi.get.mockResolvedValueOnce({ data: mockData2 });

    const { result } = renderHook(() =>
      useFetchData(["/categories", "/courses"])
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([mockData1, mockData2]);
    expect(mockApi.get).toHaveBeenCalledTimes(2);
  });

  it("UT-051: should handle fetch errors gracefully", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchData(["/categories"]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Data should remain empty on error
    expect(result.current.data).toEqual([]);
  });

  it("UT-052: should handle refresh", async () => {
    const mockData = { docs: [{ id: 1 }] };
    mockApi.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetchData(["/categories"]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Trigger refresh
    act(() => {
      result.current.onRefresh();
    });

    // Wait for refresh to complete
    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(false);
    });

    expect(mockApi.get).toHaveBeenCalledTimes(2); // Initial + refresh
  });

  it("UT-053: should not refetch if endpoints unchanged", async () => {
    const mockData = { docs: [] };
    mockApi.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetchData(["/categories"]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should only be called once for initial fetch
    expect(mockApi.get).toHaveBeenCalledTimes(1);
  });
});
